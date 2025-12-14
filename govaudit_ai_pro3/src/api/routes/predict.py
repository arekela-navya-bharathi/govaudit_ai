from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json
import re

router = APIRouter()

DATA_DIR = "data/raw"
RESULTS_DIR = "data/results"

os.makedirs(RESULTS_DIR, exist_ok=True)


# ---------------- Request Schema ----------------
class PredictRequest(BaseModel):
    filename: str


# ---------------- Field Extraction ----------------
def extract_fields(text: str):
    fields = {}

    # Invoice number (INV-7777)
    invoice_match = re.search(r"INV[-\d]+", text, re.IGNORECASE)
    if invoice_match:
        fields["invoice_number"] = invoice_match.group().upper()

    # Vendor
    vendor_match = re.search(r"Vendor\s*:\s*(.+)", text, re.IGNORECASE)
    if vendor_match:
        fields["vendor"] = vendor_match.group(1).strip()

    # Total (supports decimals)
    total_match = re.search(
        r"(Total Amount|Total)\s*:\s*([\d]+(?:\.[\d]+)?)",
        text,
        re.IGNORECASE
    )
    if total_match:
        fields["total"] = total_match.group(2)

    # Date (YYYY-MM-DD)
    date_match = re.search(
        r"Date\s*:\s*(\d{4}-\d{2}-\d{2})",
        text,
        re.IGNORECASE
    )
    if date_match:
        fields["date"] = date_match.group(1)

    return fields


# ---------------- Risk Logic ----------------
def calculate_risk(fields):
    score = 0
    flags = []

    # High amount risk
    total = fields.get("total")
    if total and float(total) > 30000:
        score += 30
        flags.append("High invoice amount")

    # Duplicate invoice detection
    invoice_no = fields.get("invoice_number")
    if invoice_no:
        for file in os.listdir(RESULTS_DIR):
            if not file.endswith(".json"):
                continue
            with open(os.path.join(RESULTS_DIR, file), "r") as f:
                old = json.load(f)
                old_inv = old.get("extraction", {}).get("fields", {}).get("invoice_number")
                if old_inv == invoice_no:
                    score += 40
                    flags.append("Duplicate invoice detected")
                    break

    # Missing vendor
    if "vendor" not in fields:
        score += 20
        flags.append("Vendor name missing")

    return {
        "score": min(score, 100),
        "flags": flags
    }


# ---------------- API Endpoint ----------------
@router.post("/")
def predict(payload: PredictRequest):
    file_path = os.path.join(DATA_DIR, payload.filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    extraction = {
        "fields": extract_fields(text),
        "raw_text": text
    }

    risk = calculate_risk(extraction["fields"])

    result = {
        "ok": True,
        "extraction": extraction,
        "risk": risk
    }

    # Save result for Documents page
    with open(os.path.join(RESULTS_DIR, f"{payload.filename}.json"), "w") as f:
        json.dump(result, f, indent=2)

    return result
