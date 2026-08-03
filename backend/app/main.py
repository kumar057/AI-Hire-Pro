from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.middleware.rate_limit import AuthRateLimitMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.routers import admin, ai, applications, auth, candidate, company, health, jobs, users
from app.utils.logging import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.LOG_LEVEL)

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG,
        docs_url="/docs" if settings.ENABLE_DOCS else None,
        redoc_url="/redoc" if settings.ENABLE_DOCS else None,
        openapi_url="/openapi.json" if settings.ENABLE_DOCS else None,
    )

    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(AuthRateLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix=settings.API_PREFIX, tags=["auth"])
    app.include_router(admin.router, prefix=settings.API_PREFIX, tags=["admin"])
    app.include_router(ai.router, prefix=settings.API_PREFIX, tags=["ai"])
    app.include_router(applications.router, prefix=settings.API_PREFIX, tags=["applications"])
    app.include_router(candidate.router, prefix=settings.API_PREFIX, tags=["candidate"])
    app.include_router(company.router, prefix=settings.API_PREFIX, tags=["company"])
    app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])
    app.include_router(jobs.router, prefix=settings.API_PREFIX, tags=["jobs"])
    app.include_router(users.router, prefix=settings.API_PREFIX, tags=["users"])

    return app


app = create_app()
