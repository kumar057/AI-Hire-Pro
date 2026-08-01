from __future__ import annotations

import hashlib
import hmac
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from typing import Any
from uuid import uuid4

from jose import JWTError, jwt

from app.config.settings import get_settings

RESERVED_CLAIMS = frozenset({"sub", "type", "jti", "exp", "iat"})


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"
    PASSWORD_RESET = "password_reset"


def create_token(
    subject: str,
    token_type: TokenType,
    expires_delta: timedelta,
    claims: dict[str, Any] | None = None,
) -> tuple[str, datetime]:
    settings = get_settings()
    issued_at = datetime.now(UTC)
    expires_at = issued_at + expires_delta
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type.value,
        "jti": str(uuid4()),
        "exp": expires_at,
        "iat": issued_at,
    }

    if claims:
        payload.update(
            {key: value for key, value in claims.items() if key not in RESERVED_CLAIMS}
        )

    encoded_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_token, expires_at


def create_access_token(subject: str, claims: dict[str, Any] | None = None) -> str:
    settings = get_settings()
    token, _ = create_token(
        subject,
        TokenType.ACCESS,
        timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        claims,
    )
    return token


def create_refresh_token(
    subject: str, claims: dict[str, Any] | None = None
) -> tuple[str, datetime]:
    settings = get_settings()
    return create_token(
        subject,
        TokenType.REFRESH,
        timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        claims,
    )


def password_reset_fingerprint(password_hash: str) -> str:
    return hash_token(password_hash)


def create_password_reset_token(subject: str, password_hash: str) -> str:
    settings = get_settings()
    token, _ = create_token(
        subject,
        TokenType.PASSWORD_RESET,
        timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES),
        {"pwd": password_reset_fingerprint(password_hash)},
    )
    return token


def decode_token(token: str, expected_type: TokenType | None = None) -> dict[str, Any]:
    settings = get_settings()

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc

    if expected_type and payload.get("type") != expected_type.value:
        raise ValueError("Invalid token type")

    return payload


def decode_access_token(token: str) -> dict[str, Any]:
    return decode_token(token, TokenType.ACCESS)


def hash_token(token: str) -> str:
    settings = get_settings()
    return hmac.new(
        settings.JWT_SECRET_KEY.encode("utf-8"),
        token.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
