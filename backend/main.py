from dotenv import load_dotenv
load_dotenv()  # Load .env before anything else reads os.getenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import models
from database import engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Create upload directories
Path("uploads/diagnosis").mkdir(parents=True, exist_ok=True)
Path("uploads/community").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="LeafScan API",
    description="AI-powered plant disease detection and agricultural assistant",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    redirect_slashes=False,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static Files ─────────────────────────────────────────────────────────────
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Routers ──────────────────────────────────────────────────────────────────
from routes.auth import router as auth_router
from routes.diagnosis import router as diagnosis_router
from routes.chatbot import router as chatbot_router
from routes.community import router as community_router
from routes.weather import router as weather_router
from routes.history import router as history_router
from routes.tips import router as tips_router
from routes.market import router as market_router
from routes.calendar import router as calendar_router
from routes.calculator import router as calculator_router
from routes.crop_recommend import router as crop_recommend_router

app.include_router(auth_router)
app.include_router(diagnosis_router)
app.include_router(chatbot_router)
app.include_router(community_router)
app.include_router(weather_router)
app.include_router(history_router)
app.include_router(tips_router)
app.include_router(market_router)
app.include_router(calendar_router)
app.include_router(calculator_router)
app.include_router(crop_recommend_router)


@app.get("/")
def root():
    return {
        "app": "LeafScan API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/api/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "LeafScan API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
