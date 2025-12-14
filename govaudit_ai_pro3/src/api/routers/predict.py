from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path
from src.pipelines.ocr_extract import extract_document
from src.agents.fraud_agent import score as fraud_score

router = APIRouter()
SEEN = set()

class PredictRequest(BaseModel):
    file_path: str

@router.post("/predict")
async def predict(req: PredictRequest):
    p = Path(req.file_path)
    if not p.exists():
        return {"ok": False, "error": "file not found"}
    res = extract_document(str(p))
    risk = fraud_score(res, SEEN)
    return {"ok": True, "extraction": res, "risk": risk}
