from __future__ import annotations

import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.auth.permissions import get_permissions_for_role
from app.models.user import UserRole

PHONE_PATTERN = re.compile(r"^\+?[1-9]\d{7,14}$")


def normalize_optional_phone(value: str | None) -> str | None:
    if value is None or value == "":
        return None

    normalized = re.sub(r"[\s().-]", "", value)
    if not PHONE_PATTERN.match(normalized):
        raise ValueError("Phone number must be a valid international number")

    return normalized


class CompanyPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str
    website: str | None = None
    logo: str | None = None
    industry: str | None = None
    company_size: str | None = None
    location: str | None = None
    description: str | None = None


class CompanyCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=180)
    website: str | None = Field(default=None, max_length=512)
    logo: str | None = Field(default=None, max_length=512)
    industry: str | None = Field(default=None, max_length=120)
    company_size: str | None = Field(default=None, max_length=64)
    location: str | None = Field(default=None, max_length=180)
    description: str | None = Field(default=None, max_length=4000)


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    role: UserRole
    avatar: str | None = None
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    company: CompanyPublic | None = None
    permissions: list[str] = Field(default_factory=list)

    @classmethod
    def from_user(cls, user) -> UserPublic:
        payload = cls.model_validate(user)
        payload.permissions = get_permissions_for_role(user.role)
        return payload


class UserUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    phone: str | None = None
    avatar: str | None = Field(default=None, max_length=512)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_optional_phone(value)
