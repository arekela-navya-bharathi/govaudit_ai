# src/api/routes/ingest.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import uuid
import shutil

router = APIRouter()

# Folder to store uploaded/scanned documents
DOCS_DIR = "data/documents"

# Make sure folder exists
os.makedirs(DOCS_DIR, exist_ok=True)

# ✅ POST: upload one or multiple files
@router.post("/docs")
async def upload_documents(files: list[UploadFile] = File(...)):
    saved_files = []

    for file in files:
        try:
            # generate unique filename to prevent overwrite
            filename = f"{uuid.uuid4()}_{file.filename}"
            filepath = os.path.join(DOCS_DIR, filename)

            # save file to disk
            with open(filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)

            saved_files.append(filename)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save {file.filename}: {str(e)}")

    return {"status": "success", "files": saved_files}

# ✅ GET: list all uploaded/scanned documents
@router.get("/docs")
async def list_documents():
    if not os.path.exists(DOCS_DIR):
        return {"status": "success", "documents": []}

    files = [f for f in os.listdir(DOCS_DIR) if os.path.isfile(os.path.join(DOCS_DIR, f))]
    return {"status": "success", "documents": files}

# ✅ GET: download a specific document
@router.get("/docs/{filename}")
async def download_document(filename: str):
    filepath = os.path.join(DOCS_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, media_type="application/octet-stream", filename=filename)
