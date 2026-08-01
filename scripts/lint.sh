#!/usr/bin/env bash
set -euo pipefail

npm run lint:frontend

cd backend
if [ -x ./.venv/bin/python ]; then
  ./.venv/bin/python -m ruff check .
  ./.venv/bin/python -m mypy app
else
  python -m ruff check .
  python -m mypy app
fi

