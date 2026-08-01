from __future__ import annotations

import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.config.settings import get_settings


class AuthRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self._attempts: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.method != "POST" or "/auth/" not in request.url.path:
            return await call_next(request)

        settings = get_settings()
        client_host = request.client.host if request.client else "unknown"
        key = f"{client_host}:{request.url.path}"
        now = time.monotonic()
        attempts = self._attempts[key]

        while attempts and now - attempts[0] > settings.AUTH_RATE_LIMIT_WINDOW_SECONDS:
            attempts.popleft()

        if len(attempts) >= settings.AUTH_RATE_LIMIT_MAX_ATTEMPTS:
            return JSONResponse(
                {"detail": "Too many authentication attempts. Please try again shortly."},
                status_code=429,
            )

        attempts.append(now)
        return await call_next(request)
