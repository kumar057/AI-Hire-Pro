$ErrorActionPreference = "Stop"

Write-Host "Installing frontend dependencies..."
npm install --workspace frontend

Write-Host "Creating backend virtual environment..."
Push-Location backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
Pop-Location

Write-Host "Bootstrap complete."

