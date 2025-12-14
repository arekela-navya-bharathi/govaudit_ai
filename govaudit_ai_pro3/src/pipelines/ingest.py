import argparse
from pathlib import Path
import shutil
from src.services.db import get_conn

RAW_DIR = Path('data/raw')
RAW_DIR.mkdir(parents=True, exist_ok=True)

def ingest_local(source_dir, limit=10):
    src = Path(source_dir)
    files = list(src.glob('*'))[:limit]
    for f in files:
        dest = RAW_DIR / f.name
        shutil.copy(f, dest)
        with get_conn() as c:
            c.execute("INSERT INTO documents(path) VALUES (?)", (str(dest),))
        print('Ingested', dest)

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--source', required=True)
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    ingest_local(args.source, args.limit)
