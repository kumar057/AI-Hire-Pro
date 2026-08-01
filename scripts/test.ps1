$ErrorActionPreference = "Stop"

Push-Location backend
if (Test-Path .venv\Scripts\python.exe) {
  .\.venv\Scripts\python.exe -m pytest
} else {
  python -m pytest
}
Pop-Location

