from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "data/raw"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "ok": True,
        "path": file_path
    }


DATA_DIR = "data/raw"

@router.get("/docs")
def list_documents():
    docs = []

    if not os.path.exists(DATA_DIR):
        return {"docs": []}

    for file in os.listdir(DATA_DIR):
        if file.endswith(".txt"):
            docs.append({
                "file": file,
                "type": "Invoice",
                "risk_score": 20  # temp static (or read from DB later)
            })

    return {"docs": docs}


RESULTS_DIR = "data/results"

@router.get("/docs")
def list_documents():
    docs = []

    for file in os.listdir(DATA_DIR):
        if not file.endswith(".txt"):
            continue

        score = 0
        result_file = f"{RESULTS_DIR}/{file}.json"

        if os.path.exists(result_file):
            with open(result_file) as f:
                score = json.load(f)["risk"]["score"]

        docs.append({
            "file": file,
            "type": "Invoice",
            "risk_score": score
        })

    return {"docs": docs}
