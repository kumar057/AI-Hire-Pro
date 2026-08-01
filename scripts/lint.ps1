$ErrorActionPreference = "Stop"

npm run lint:frontend

Push-Location backend
if (Test-Path .venv\Scripts\python.exe) {
  .\.venv\Scripts\python.exe -m ruff check .
  .\.venv\Scripts\python.exe -m mypy app
} else {
  python -m ruff check .
  python -m mypy app
}
Pop-Location

