from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ CORRECT IMPORT (api is inside src/)
from src.api.routes.predict import router

app = FastAPI(
    title="GovAudit AI API",
    version="1.0.0"
)

# ✅ CORS (required for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Health check
@app.get("/")
def root():
    return {"status": "GovAudit AI backend running"}

# ✅ Register routes
app.include_router(router, prefix="/v1")
