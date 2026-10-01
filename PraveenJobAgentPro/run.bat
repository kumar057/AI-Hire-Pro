@echo off
setlocal
cd /d "%~dp0"
if not exist .venv python -m venv .venv
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install chromium
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
