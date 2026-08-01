from __future__ import annotations

import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.auth.password import validate_password_strength
from app.models.user import UserRole
from app.schemas.user import CompanyCreate, UserPublic, normalize_optional_phone


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = None
    password: str
    role: UserRole
    company: CompanyCreate | None = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_optional_phone(value)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        try:
            validate_password_strength(value)
        except ValueError as exc:
            raise ValueError(str(exc)) from exc
        return value

    @model_validator(mode="after")
    def validate_role_payload(self) -> RegisterRequest:
        if self.role == UserRole.ADMIN:
            raise ValueError("Admin users cannot be registered through the public API")

        if self.role == UserRole.COMPANY and self.company is None:
            raise ValueError("Company registration requires company details")

        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthResponse(TokenResponse):
    user: UserPublic


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class LogoutRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class MessageResponse(BaseModel):
    message: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=20)
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        try:
            validate_password_strength(value)
        except ValueError as exc:
            raise ValueError(str(exc)) from exc
        return value


class PasswordStrengthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_valid: bool
    requirements: dict[str, bool]


def password_requirements(password: str) -> PasswordStrengthResponse:
    requirements = {
        "length": len(password) >= 12,
        "uppercase": bool(re.search(r"[A-Z]", password)),
        "lowercase": bool(re.search(r"[a-z]", password)),
        "number": bool(re.search(r"\d", password)),
        "special": bool(re.search(r"[^A-Za-z0-9]", password)),
    }
    return PasswordStrengthResponse(
        is_valid=all(requirements.values()),
        requirements=requirements,
    )

