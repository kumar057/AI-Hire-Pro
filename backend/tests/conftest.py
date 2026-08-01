from __future__ import annotations

import asyncio
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, tmp_path) -> Generator[TestClient, None, None]:
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{db_path}")
    monkeypatch.setenv("APP_DEBUG", "false")
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-key-for-auth-suite")
    monkeypatch.setenv("AUTH_RATE_LIMIT_MAX_ATTEMPTS", "100")

    from app import models  # noqa: F401
    from app.config.settings import get_settings
    from app.database.base import Base

    get_settings.cache_clear()

    from app.database.session import get_db_session
    from app.main import create_app

    engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", echo=False)
    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False)

    async def create_schema() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

    async def override_get_db_session():
        async with session_factory() as session:
            yield session

    asyncio.run(create_schema())

    app = create_app()
    app.dependency_overrides[get_db_session] = override_get_db_session
    app.state.test_session_factory = session_factory

    with TestClient(app) as test_client:
        yield test_client

    asyncio.run(engine.dispose())
