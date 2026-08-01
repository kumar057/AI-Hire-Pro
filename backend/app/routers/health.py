from fastapi import APIRouter

from app.config.settings import get_settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Service health check")
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(service=settings.APP_NAME, status="ok", version=settings.APP_VERSION)

