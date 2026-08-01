from __future__ import annotations

import json
from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AIHire Pro API"
    APP_ENV: Literal["local", "development", "staging", "production", "test"] = "local"
    APP_VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = Field(default=False, validation_alias="APP_DEBUG")
    ENABLE_DOCS: bool = True
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = "postgresql+asyncpg://aihire:aihire@localhost:5432/aihire_pro"

    JWT_SECRET_KEY: str = Field(default="change-me-in-local-dev", min_length=16)
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 15
    AUTH_RATE_LIMIT_MAX_ATTEMPTS: int = 8
    AUTH_RATE_LIMIT_WINDOW_SECONDS: int = 60

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value

        if value.startswith("["):
            parsed = json.loads(value)
            if not isinstance(parsed, list):
                raise ValueError("CORS_ORIGINS JSON value must be a list")
            return [str(origin) for origin in parsed]

        return [origin.strip() for origin in value.split(",") if origin.strip()]

    @model_validator(mode="after")
    def validate_production_settings(self) -> Settings:
        unsafe_secrets = {"change-me", "replace-me", "change-me-in-local-dev"}
        if self.APP_ENV == "production" and self.JWT_SECRET_KEY in unsafe_secrets:
            raise ValueError("JWT_SECRET_KEY must be set to a strong secret in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
