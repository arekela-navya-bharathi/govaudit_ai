from pathlib import Path
from typing import Dict, Any
try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except Exception:
    OCR_AVAILABLE = False

def _read_text_file(p: Path) -> str:
    try:
        return p.read_text(errors="ignore")
    except Exception:
        return ""
def _ocr_image(p: Path) -> str:
    if not OCR_AVAILABLE:
        return ""
    try:
        img = Image.open(p)
        return pytesseract.image_to_string(img)
    except Exception:
        return ""
def extract_document(file_path: str) -> Dict[str, Any]:
    p = Path(file_path)
    text = ""
    if p.suffix.lower() in {".txt"}:
        text = _read_text_file(p)
    elif p.suffix.lower() in {".png",".jpg",".jpeg",".tif",".tiff"}:
        text = _ocr_image(p)
    elif p.suffix.lower() == ".pdf":
        try:
            from pdf2image import convert_from_path
            pages = convert_from_path(str(p), dpi=200)
            if OCR_AVAILABLE:
                text = "\n".join(pytesseract.image_to_string(pg) for pg in pages)
        except Exception:
            text = _read_text_file(p)
    else:
        text = _read_text_file(p)
    def find(tag, default=""):
        for line in text.splitlines():
            if tag.lower() in line.lower():
                parts = line.split(":")
                if len(parts) > 1:
                    return parts[-1].strip()
        return default
    return {
        "file": str(p),
        "raw_text": text[:4000],
        "fields": {
            "invoice_number": find("invoice"),
            "date": find("date"),
            "vendor": find("vendor"),
            "total": find("total"),
        },
        "tables": []
    }
