# Development Workflow

## Local Services

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Start the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Start the frontend:

```bash
npm install --workspace frontend
npm run dev:frontend
```

## Quality Gates

Backend:

```bash
cd backend
ruff check .
mypy app
pytest
```

Frontend:

```bash
npm run lint:frontend
npm run build:frontend
```

## Migrations

Create a migration:

```bash
cd backend
alembic revision --autogenerate -m "describe change"
```

Apply migrations:

```bash
cd backend
alembic upgrade head
```

