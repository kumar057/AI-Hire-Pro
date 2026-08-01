# AIHire Pro

AIHire Pro is an enterprise AI-powered job portal foundation. This repository is
initialized as a scalable monorepo with a React frontend, FastAPI backend,
PostgreSQL configuration, Docker runtime assets, and development automation.

Business features such as login, dashboards, job workflows, and AI hiring logic
are intentionally not implemented yet.

## Architecture

- `frontend/` - React 19, Vite, Tailwind CSS, React Router, Axios, Framer Motion, GSAP, React Hook Form, React Icons, ESLint, and Prettier.
- `backend/` - FastAPI, SQLAlchemy, Alembic, Pydantic, JWT utilities, structured logging, middleware, and tests.
- `database/` - PostgreSQL initialization scripts and local database tuning baseline.
- `docker/` - Production-oriented Dockerfiles and Nginx configuration.
- `docs/` - Architecture, development workflow, and security notes.
- `scripts/` - Bootstrap, development, lint, and test helpers for Windows and Unix shells.

## Project Structure

```text
AIHire Pro/
├── frontend/
│   └── src/
│       ├── animations/
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
├── database/
├── docker/
├── docs/
└── scripts/
```

## Prerequisites

- Node.js 22+
- npm 10+
- Python 3.12+
- Docker Desktop

## Environment Setup

Create local environment files from the provided examples:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

For Unix shells:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## Install Dependencies

Windows:

```powershell
.\scripts\bootstrap.ps1
```

Unix:

```bash
chmod +x scripts/*.sh
./scripts/bootstrap.sh
```

## Run Locally

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Start the frontend:

```bash
npm run dev:frontend
```

The frontend runs on `http://localhost:5173` and the backend API runs on
`http://localhost:8000/api/v1`.

## Docker

Build and run the full local stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:4173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Database Migrations

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

## Quality Workflow

Frontend:

```bash
npm run lint:frontend
npm run build:frontend
```

Backend:

```bash
cd backend
ruff check .
mypy app
pytest
```

## Engineering Standards

- Keep business domains isolated behind routers, schemas, services, repositories, and models.
- Keep secrets out of Git and environment-specific config outside source control.
- Add tests with each new use case, especially around API contracts and repository behavior.
- Prefer small vertical slices when business functionality begins.
- Run migrations through controlled CI/CD gates before production deployment.

