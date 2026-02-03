from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

# Ensure outputs directory exists
outputs_dir = Path("outputs")
outputs_dir.mkdir(exist_ok=True)

app = FastAPI(title="Visplain", version="0.1.0")

# Mount static files
app.mount("/assets", StaticFiles(directory="app/web/assets"), name="assets")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"ok": True}


@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main page"""
    index_path = Path("app/web/index.html")
    return index_path.read_text()
