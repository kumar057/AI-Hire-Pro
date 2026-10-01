from fastapi import FastAPI
from fastapi.responses import FileResponse
from pathlib import Path
app = FastAPI(title="Praveen Job Agent Pro")
ROOT = Path(__file__).resolve().parents[1]
@app.get("/")
def home():
    return FileResponse(ROOT / "web" / "index.html")
@app.get("/api/health")
def health():
    return {"status": "ok", "agent": "local-first", "automation": "windows"}
