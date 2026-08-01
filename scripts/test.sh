#!/usr/bin/env bash
set -euo pipefail

cd backend
if [ -x ./.venv/bin/python ]; then
  ./.venv/bin/python -m pytest
else
  python -m pytest
fi

