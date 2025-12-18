from fastapi import APIRouter, UploadFile, File
from typing import List
import os, uuid, json

router = APIRouter()

DOWNLOAD_DIR = "downloaded_files"
HISTORY_FILE = "analysis_history.json"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Load existing history
def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []

# Save updated history
def save_history(results):
    history = load_history()
    history.extend(results)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

@router.post("/predict")
async def predict(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        content = await file.read()
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        
        # Save uploaded file for download
        with open(file_path, "wb") as f:
            f.write(content)

        # Simple risk logic
        size_kb = len(content) / 1024
        risk_score = min(int(size_kb), 100)
        flags = ["Large document – requires review"] if risk_score > 60 else []

        results.append({
            "file": file.filename,
            "type": file.content_type,
            "risk_score": risk_score,
            "flags": flags,
            "download_url": f"/v1/download/{filename}"
        })

    # Save results to history
    save_history(results)

    return {"status": "success", "results": results}

@router.get("/history")
def get_history():
    return {"status": "success", "results": load_history()}

# Endpoint to serve file downloads
from fastapi.responses import FileResponse

@router.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(DOWNLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    return {"error": "File not found"}
