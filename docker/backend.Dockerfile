# syntax=docker/dockerfile:1.7

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN useradd --create-home --shell /usr/sbin/nologin appuser

COPY backend/pyproject.toml ./pyproject.toml
COPY backend/app ./app

RUN pip install --upgrade pip && pip install -e .

COPY backend/alembic.ini ./alembic.ini
COPY backend/alembic ./alembic

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

