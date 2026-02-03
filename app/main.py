from pathlib import Path
from fastapi import FastAPI

# Ensure outputs directory exists
outputs_dir = Path("outputs")
outputs_dir.mkdir(exist_ok=True)

app = FastAPI(title="Visplain", version="0.1.0")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"ok": True}
