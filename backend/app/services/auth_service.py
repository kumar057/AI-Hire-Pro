from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import (
    TokenType,
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    decode_token,
    hash_token,
    password_reset_fingerprint,
)
from app.auth.password import hash_password, verify_password
from app.config.settings import get_settings
from app.models.company import Company
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.company_repository import CompanyRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthResponse, RegisterRequest, TokenResponse
from app.schemas.user import UserPublic, UserUpdate

logger = logging.getLogger(__name__)


class AuthError(Exception):
    pass


class DuplicateEmailError(AuthError):
    pass


class InvalidCredentialsError(AuthError):
    pass


def _is_expired(expires_at: datetime) -> bool:
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    return expires_at <= datetime.now(UTC)


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.companies = CompanyRepository(session)
        self.refresh_tokens = RefreshTokenRepository(session)

    async def register(self, payload: RegisterRequest) -> AuthResponse:
        existing_user = await self.users.get_by_email(payload.email)
        if existing_user is not None:
            raise DuplicateEmailError("Email is already registered")

        user = User(
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            email=payload.email.lower(),
            phone=payload.phone,
            password_hash=hash_password(payload.password),
            role=payload.role,
        )

        await self.users.create(user)

        if payload.company is not None:
            await self.companies.create(
                Company(
                    owner_id=user.id,
                    company_name=payload.company.company_name.strip(),
                    website=payload.company.website,
                    logo=payload.company.logo,
                    industry=payload.company.industry,
                    company_size=payload.company.company_size,
                    location=payload.company.location,
                    description=payload.company.description,
                )
            )

        tokens = await self._issue_token_pair(user)
        await self.session.commit()

        created_user = await self.users.get_by_uuid(user.uuid)
        if created_user is None:
            raise AuthError("Unable to load registered user")

        logger.info("Registered user %s with role %s", created_user.uuid, created_user.role.value)
        return AuthResponse(**tokens.model_dump(), user=UserPublic.from_user(created_user))

    async def login(self, email: str, password: str) -> AuthResponse:
        user = await self.users.get_by_email(email)
        if user is None or not user.is_active or not verify_password(password, user.password_hash):
            logger.warning("Failed login attempt")
            raise InvalidCredentialsError("Invalid email or password")

        tokens = await self._issue_token_pair(user)
        await self.session.commit()
        logger.info("User %s logged in", user.uuid)
        return AuthResponse(**tokens.model_dump(), user=UserPublic.from_user(user))

    async def refresh(self, refresh_token: str) -> AuthResponse:
        try:
            decode_token(refresh_token, TokenType.REFRESH)
        except ValueError as exc:
            raise InvalidCredentialsError("Invalid refresh token") from exc

        session_record = await self.refresh_tokens.get_by_hash(hash_token(refresh_token))
        if (
            session_record is None
            or session_record.revoked_at is not None
            or _is_expired(session_record.expires_at)
            or not session_record.user.is_active
        ):
            raise InvalidCredentialsError("Invalid refresh token")

        await self.refresh_tokens.revoke(session_record)
        tokens = await self._issue_token_pair(session_record.user)
        await self.session.commit()
        logger.info("Rotated auth session for user %s", session_record.user.uuid)
        return AuthResponse(**tokens.model_dump(), user=UserPublic.from_user(session_record.user))

    async def logout(self, refresh_token: str) -> None:
        session_record = await self.refresh_tokens.get_by_hash(hash_token(refresh_token))
        if session_record is not None and session_record.revoked_at is None:
            await self.refresh_tokens.revoke(session_record)
            await self.session.commit()
            logger.info("Revoked auth session for user %s", session_record.user.uuid)

    async def forgot_password(self, email: str) -> None:
        user = await self.users.get_by_email(email)
        if user is not None and user.is_active:
            create_password_reset_token(user.uuid, user.password_hash)
            logger.info("Password reset requested for user %s", user.uuid)

    async def reset_password(self, token: str, password: str) -> None:
        try:
            payload = decode_token(token, TokenType.PASSWORD_RESET)
        except ValueError as exc:
            raise InvalidCredentialsError("Invalid or expired reset token") from exc

        subject = payload.get("sub")
        if not isinstance(subject, str):
            raise InvalidCredentialsError("Invalid or expired reset token")

        user = await self.users.get_by_uuid(subject)
        if user is None or not user.is_active:
            raise InvalidCredentialsError("Invalid or expired reset token")

        if payload.get("pwd") != password_reset_fingerprint(user.password_hash):
            raise InvalidCredentialsError("Invalid or expired reset token")

        user.password_hash = hash_password(password)
        await self.refresh_tokens.revoke_all_for_user(user.id)
        await self.session.commit()
        logger.info("Password reset completed for user %s", user.uuid)

    async def update_profile(self, user: User, payload: UserUpdate) -> UserPublic:
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        await self.session.commit()
        updated_user = await self.users.get_by_uuid(user.uuid)
        if updated_user is None:
            raise AuthError("Unable to load updated user")

        return UserPublic.from_user(updated_user)

    async def _issue_token_pair(self, user: User) -> TokenResponse:
        settings = get_settings()
        access_token = create_access_token(
            user.uuid,
            claims={"email": user.email, "role": user.role.value},
        )
        refresh_token, refresh_expires_at = create_refresh_token(
            user.uuid,
            claims={"email": user.email, "role": user.role.value},
        )

        await self.refresh_tokens.create(
            RefreshToken(
                user_id=user.id,
                token_hash=hash_token(refresh_token),
                expires_at=refresh_expires_at,
            )
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
