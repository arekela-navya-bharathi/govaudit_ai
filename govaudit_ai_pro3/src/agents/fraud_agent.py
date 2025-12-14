import re
def _parse_amount(val: str) -> float:
    if not val:
        return 0.0
    try:
        return float(re.sub(r"[^0-9.]", "", val))
    except Exception:
        return 0.0
def score(extraction, seen_invoices: set):
    flags = []
    inv = (extraction.get("fields", {}) or {}).get("invoice_number", "").strip()
    total = _parse_amount((extraction.get("fields", {}) or {}).get("total", "0"))
    if inv and inv in seen_invoices:
        flags.append("duplicate_invoice_number")
    if total > 100000:
        flags.append("high_amount")
    risk = 0.0
    if "high_amount" in flags: risk += 0.6
    risk += 0.2 * len(flags)
    risk = min(1.0, risk)
    if inv: seen_invoices.add(inv)
    return {"score": round(risk, 2), "flags": flags}
