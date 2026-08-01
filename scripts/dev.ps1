$ErrorActionPreference = "Stop"

docker compose up -d postgres

Write-Host "PostgreSQL is starting in Docker."
Write-Host "Backend:  cd backend; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload"
Write-Host "Frontend: npm run dev:frontend"

