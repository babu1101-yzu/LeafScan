from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Post Schemas ─────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    tags: Optional[str] = None


class CommentOut(BaseModel):
    id: int
    content: str
    author: UserOut
    created_at: datetime

    class Config:
        from_attributes = True


class PostOut(BaseModel):
    id: int
    title: str
    content: str
    image_url: Optional[str]
    tags: Optional[str]
    likes_count: int
    author: UserOut
    comments: List[CommentOut] = []
    created_at: datetime

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    content: str


# ─── Diagnosis Schemas ────────────────────────────────────────────────────────

class DiagnosisOut(BaseModel):
    id: int
    image_url: str
    disease_name: Optional[str]
    confidence: Optional[float]
    crop_type: Optional[str]
    recommendations: Optional[str]
    is_healthy: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── History Schemas ──────────────────────────────────────────────────────────

class HistoryOut(BaseModel):
    id: int
    query: str
    result_type: Optional[str]
    result_summary: Optional[str]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Chat Schemas ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    timestamp: datetime


# ─── Weather Schemas ──────────────────────────────────────────────────────────

class WeatherAlert(BaseModel):
    type: str
    severity: str
    message: str


class WeatherData(BaseModel):
    city: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    description: str
    icon: str
    alerts: List[WeatherAlert] = []
