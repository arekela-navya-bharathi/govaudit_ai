from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import ingest, predict, health

app = FastAPI(
    title="GovAudit AI",
    description="Government Confidential AI Audit System",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(ingest.router, prefix="/v1/ingest", tags=["Ingest"])
app.include_router(predict.router, prefix="/v1", tags=["Predict"])
