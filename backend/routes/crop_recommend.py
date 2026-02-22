from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_active_user
import models
from pydantic import BaseModel, Field
from typing import Optional
import crop_recommendation

router = APIRouter(prefix="/api/crop-recommend", tags=["Crop Recommendation"])


class SoilInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen ratio in soil (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus ratio in soil (kg/ha)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium ratio in soil (kg/ha)")
    temperature: float = Field(..., ge=0, le=55, description="Average temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity (%)")
    ph: float = Field(..., ge=3.0, le=10.0, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Annual rainfall (mm)")
    top_n: Optional[int] = Field(3, ge=1, le=5, description="Number of top crops to return")


@router.post("/predict")
def predict_crop(
    data: SoilInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """
    Predict the best crops for given soil and climate conditions.
    Uses a trained Random Forest ML model.
    """
    try:
        recommendations = crop_recommendation.predict_crops(
            N=data.nitrogen,
            P=data.phosphorus,
            K=data.potassium,
            temperature=data.temperature,
            humidity=data.humidity,
            ph=data.ph,
            rainfall=data.rainfall,
            top_n=data.top_n,
        )

        soil_analysis = crop_recommendation.get_soil_analysis(
            N=data.nitrogen,
            P=data.phosphorus,
            K=data.potassium,
            ph=data.ph,
        )

        # Save to history
        top_crop = recommendations[0]['crop_display'] if recommendations else 'Unknown'
        history = models.SearchHistory(
            user_id=current_user.id,
            query=f"Crop Recommendation: N={data.nitrogen}, P={data.phosphorus}, K={data.potassium}, pH={data.ph}",
            result_type="crop_recommendation",
            result_summary=f"Top recommendation: {top_crop} ({recommendations[0]['confidence']}% confidence)" if recommendations else "No recommendation",
        )
        db.add(history)
        db.commit()

        return {
            "recommendations": recommendations,
            "soil_analysis": soil_analysis,
            "input": data.model_dump(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/crops")
def get_all_crops():
    """Return list of all 22 supported crops with their info."""
    result = []
    for crop in crop_recommendation.CROPS:
        info = crop_recommendation.CROP_INFO.get(crop, {})
        result.append({
            'crop': crop,
            'crop_display': crop.replace('kidneybeans', 'Kidney Beans').replace('mungbean', 'Mung Bean').replace('blackgram', 'Black Gram').replace('mothbeans', 'Moth Beans').replace('pigeonpeas', 'Pigeon Peas').title(),
            'emoji': crop_recommendation.CROP_EMOJI.get(crop, '🌱'),
            **info,
        })
    return result


@router.get("/model-status")
def get_model_status():
    """Check if the ML model is loaded."""
    model = crop_recommendation.get_model()
    return {
        "model_loaded": model is not None,
        "model_type": "Random Forest (scikit-learn)" if model is not None else "Rule-based fallback",
        "crops_supported": len(crop_recommendation.CROPS),
        "features": ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Temperature", "Humidity", "pH", "Rainfall"],
    }


@router.post("/analyze-soil")
def analyze_soil(
    data: SoilInput,
    current_user: models.User = Depends(get_current_active_user),
):
    """Analyze soil health without making crop predictions."""
    soil_analysis = crop_recommendation.get_soil_analysis(
        N=data.nitrogen,
        P=data.phosphorus,
        K=data.potassium,
        ph=data.ph,
    )
    return {"soil_analysis": soil_analysis}
