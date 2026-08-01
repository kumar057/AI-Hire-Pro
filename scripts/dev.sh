#!/usr/bin/env bash
set -euo pipefail

docker compose up -d postgres

echo "PostgreSQL is starting in Docker."
echo "Backend:  cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo "Frontend: npm run dev:frontend"

