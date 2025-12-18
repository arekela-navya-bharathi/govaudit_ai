import json
from pathlib import Path
from datetime import datetime

DATA_FILE = Path("data/audits.json")
DATA_FILE.parent.mkdir(exist_ok=True)

def load_audits():
    if not DATA_FILE.exists():
        return []
    return json.loads(DATA_FILE.read_text())

def save_audit(record):
    audits = load_audits()
    audits.append(record)
    DATA_FILE.write_text(json.dumps(audits, indent=2))
