from fastapi import APIRouter, UploadFile, File
import shutil
from pathlib import Path
from src.services.db import get_conn

router = APIRouter()
RAW_DIR = Path('data/raw')
RAW_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    dest = RAW_DIR / file.filename
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    with get_conn() as c:
        c.execute("INSERT INTO documents(path) VALUES (?)", (str(dest),))
    return {"ok": True, "path": str(dest)}

@router.get("/docs")
async def docs():
    with get_conn() as c:
        rows = c.execute("SELECT id, path, created_at FROM documents ORDER BY id DESC").fetchall()
        docs = [{"id": r[0], "path": r[1], "created_at": r[2]} for r in rows]
    return {"ok": True, "docs": docs}
