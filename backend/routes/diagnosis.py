from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_active_user
import models, schemas
import uuid, shutil
from pathlib import Path
from typing import List, Optional
import model_inference

router = APIRouter(prefix="/api/diagnosis", tags=["Diagnosis"])

UPLOAD_DIR = Path("uploads/diagnosis")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG/WebP images are supported")

    # Save uploaded file
    file_ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/diagnosis/{filename}"

    # Run prediction via model_inference module (real YOLOv8 or mock fallback)
    try:
        predicted_class, confidence = model_inference.predict(str(file_path), crop_hint=crop_hint)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    # Get disease info + severity score
    info = model_inference.get_disease_info(predicted_class)
    severity = model_inference.calculate_severity_score(predicted_class, confidence)
    is_healthy = "healthy" in predicted_class.lower()

    # Save diagnosis result to DB
    result = models.DiagnosisResult(
        user_id=current_user.id,
        image_url=image_url,
        disease_name=info["display"],
        confidence=confidence,
        crop_type=info["crop"],
        recommendations=info["recommendations"],
        is_healthy=is_healthy,
    )
    db.add(result)

    # Auto-save to search history
    severity_label = severity["level"]
    history = models.SearchHistory(
        user_id=current_user.id,
        query=f"Diagnosis: {info['display']}",
        result_type="diagnosis",
        result_summary=f"{info['crop']} — {info['display']} ({confidence*100:.1f}% confidence) | Severity: {severity_label}",
        image_url=image_url,
    )
    db.add(history)
    db.commit()
    db.refresh(result)

    # Return full response including severity score
    return {
        "id": result.id,
        "image_url": result.image_url,
        "disease_name": result.disease_name,
        "confidence": result.confidence,
        "crop_type": result.crop_type,
        "recommendations": result.recommendations,
        "is_healthy": result.is_healthy,
        "created_at": result.created_at,
        "severity": severity,
    }


@router.get("/history", response_model=List[schemas.DiagnosisOut])
def get_diagnosis_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return db.query(models.DiagnosisResult).filter(
        models.DiagnosisResult.user_id == current_user.id
    ).order_by(models.DiagnosisResult.created_at.desc()).limit(50).all()


@router.get("/diseases")
def get_all_diseases():
    """Return list of all detectable diseases (39 classes from dataset)."""
    return model_inference.get_all_diseases()


@router.get("/model-status")
def get_model_status():
    """Check if the trained YOLOv8 model is loaded."""
    return model_inference.get_model_info()
