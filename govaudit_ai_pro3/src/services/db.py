import sqlite3, os
os.makedirs("data", exist_ok=True)
DB_PATH = "data/govaudit.db"
def get_conn():
    return sqlite3.connect(DB_PATH)
def init():
    with get_conn() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS documents(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            vendor TEXT,
            invoice_number TEXT,
            total TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
