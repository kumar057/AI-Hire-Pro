#!/usr/bin/env bash
set -euo pipefail

echo "Installing frontend dependencies..."
npm install --workspace frontend

echo "Creating backend virtual environment..."
cd backend
python -m venv .venv
./.venv/bin/python -m pip install --upgrade pip
./.venv/bin/python -m pip install -e ".[dev]"

echo "Bootstrap complete."

