from fastapi import APIRouter, HTTPException
import os
import json

router = APIRouter()

RESULTS_DIR = "data/results"


@router.get("/{filename}")
def get_audit(filename: str):
    path = os.path.join(RESULTS_DIR, f"{filename}.json")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audit not found")

    with open(path, "r") as f:
        data = json.load(f)

    return {
        "ok": True,
        "audit": data
    }
