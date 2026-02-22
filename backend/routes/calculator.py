from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/calculator", tags=["Fertilizer Calculator"])

# NPK requirements per crop (kg/hectare for full season)
CROP_NPK = {
    "Tomato":     {"N": 150, "P": 80,  "K": 200, "emoji": "🍅", "yield_per_ha": "40-60 tonnes"},
    "Potato":     {"N": 180, "P": 90,  "K": 220, "emoji": "🥔", "yield_per_ha": "25-40 tonnes"},
    "Corn":       {"N": 200, "P": 80,  "K": 120, "emoji": "🌽", "yield_per_ha": "8-12 tonnes"},
    "Wheat":      {"N": 120, "P": 60,  "K": 80,  "emoji": "🌾", "yield_per_ha": "3-6 tonnes"},
    "Rice":       {"N": 100, "P": 50,  "K": 80,  "emoji": "🍚", "yield_per_ha": "4-8 tonnes"},
    "Soybean":    {"N": 30,  "P": 60,  "K": 80,  "emoji": "🫘", "yield_per_ha": "2-4 tonnes"},
    "Apple":      {"N": 80,  "P": 40,  "K": 100, "emoji": "🍎", "yield_per_ha": "20-40 tonnes"},
    "Grape":      {"N": 60,  "P": 30,  "K": 80,  "emoji": "🍇", "yield_per_ha": "10-20 tonnes"},
    "Pepper":     {"N": 120, "P": 60,  "K": 150, "emoji": "🌶️", "yield_per_ha": "15-25 tonnes"},
    "Strawberry": {"N": 80,  "P": 50,  "K": 120, "emoji": "🍓", "yield_per_ha": "20-30 tonnes"},
    "Onion":      {"N": 100, "P": 60,  "K": 100, "emoji": "🧅", "yield_per_ha": "20-40 tonnes"},
    "Carrot":     {"N": 80,  "P": 60,  "K": 120, "emoji": "🥕", "yield_per_ha": "30-50 tonnes"},
    "Cabbage":    {"N": 150, "P": 60,  "K": 120, "emoji": "🥬", "yield_per_ha": "40-60 tonnes"},
    "Banana":     {"N": 200, "P": 60,  "K": 300, "emoji": "🍌", "yield_per_ha": "30-50 tonnes"},
    "Mango":      {"N": 100, "P": 50,  "K": 100, "emoji": "🥭", "yield_per_ha": "10-20 tonnes"},
    "Coffee":     {"N": 120, "P": 40,  "K": 120, "emoji": "☕", "yield_per_ha": "1-3 tonnes"},
    "Tea":        {"N": 150, "P": 40,  "K": 80,  "emoji": "🍵", "yield_per_ha": "2-4 tonnes"},
    "Sugarcane":  {"N": 200, "P": 80,  "K": 200, "emoji": "🎋", "yield_per_ha": "60-100 tonnes"},
    "Cotton":     {"N": 120, "P": 60,  "K": 80,  "emoji": "🌿", "yield_per_ha": "1.5-3 tonnes"},
}

# Common fertilizer compositions (% N-P-K)
FERTILIZERS = {
    "Urea":                    {"N": 46, "P": 0,  "K": 0,  "type": "nitrogen",   "cost_per_kg": 0.45},
    "DAP (18-46-0)":           {"N": 18, "P": 46, "K": 0,  "type": "phosphorus", "cost_per_kg": 0.65},
    "MOP (0-0-60)":            {"N": 0,  "P": 0,  "K": 60, "type": "potassium",  "cost_per_kg": 0.55},
    "NPK 17-17-17":            {"N": 17, "P": 17, "K": 17, "type": "balanced",   "cost_per_kg": 0.70},
    "NPK 20-10-10":            {"N": 20, "P": 10, "K": 10, "type": "nitrogen",   "cost_per_kg": 0.68},
    "NPK 10-26-26":            {"N": 10, "P": 26, "K": 26, "type": "balanced",   "cost_per_kg": 0.72},
    "Ammonium Sulfate (21-0-0)":{"N": 21, "P": 0, "K": 0,  "type": "nitrogen",   "cost_per_kg": 0.40},
    "SSP (0-16-0)":            {"N": 0,  "P": 16, "K": 0,  "type": "phosphorus", "cost_per_kg": 0.35},
    "Compost (organic)":       {"N": 1.5,"P": 1,  "K": 1,  "type": "organic",    "cost_per_kg": 0.15},
    "Farmyard Manure":         {"N": 0.5,"P": 0.3,"K": 0.5,"type": "organic",    "cost_per_kg": 0.08},
}

# Soil type adjustment factors
SOIL_ADJUSTMENTS = {
    "Sandy":    {"N": 1.2, "P": 1.0, "K": 1.1, "note": "Sandy soils need more frequent, smaller applications"},
    "Loamy":    {"N": 1.0, "P": 1.0, "K": 1.0, "note": "Ideal soil — standard rates apply"},
    "Clay":     {"N": 0.9, "P": 1.1, "K": 0.9, "note": "Clay soils retain nutrients longer — reduce rates slightly"},
    "Silty":    {"N": 1.0, "P": 1.0, "K": 1.0, "note": "Good nutrient retention — standard rates apply"},
    "Peaty":    {"N": 0.8, "P": 1.2, "K": 1.1, "note": "High organic matter — reduce nitrogen"},
    "Chalky":   {"N": 1.1, "P": 1.3, "K": 1.0, "note": "Alkaline soil — may need pH adjustment"},
}


class CalculatorRequest(BaseModel):
    crop: str
    area_hectares: float
    soil_type: Optional[str] = "Loamy"
    soil_ph: Optional[float] = 6.5
    organic_matter: Optional[str] = "medium"  # low, medium, high


@router.get("/crops")
def get_supported_crops():
    """Get list of crops supported by the calculator."""
    return [
        {
            "crop": crop,
            "emoji": data["emoji"],
            "expected_yield": data["yield_per_ha"],
            "npk_per_ha": {"N": data["N"], "P": data["P"], "K": data["K"]},
        }
        for crop, data in CROP_NPK.items()
    ]


@router.get("/fertilizers")
def get_fertilizer_list():
    """Get list of available fertilizers."""
    return [
        {
            "name": name,
            "composition": f"{data['N']}-{data['P']}-{data['K']}",
            "type": data["type"],
            "cost_per_kg_usd": data["cost_per_kg"],
        }
        for name, data in FERTILIZERS.items()
    ]


@router.post("/calculate")
def calculate_fertilizer(request: CalculatorRequest):
    """Calculate fertilizer requirements for a crop and area."""
    crop_key = request.crop.capitalize()
    if crop_key not in CROP_NPK:
        raise HTTPException(status_code=400, detail=f"Crop '{request.crop}' not supported. Use GET /api/calculator/crops for valid options.")

    if request.area_hectares <= 0 or request.area_hectares > 10000:
        raise HTTPException(status_code=400, detail="Area must be between 0 and 10,000 hectares")

    soil_key = request.soil_type.capitalize() if request.soil_type else "Loamy"
    if soil_key not in SOIL_ADJUSTMENTS:
        soil_key = "Loamy"

    crop_data = CROP_NPK[crop_key]
    soil_adj = SOIL_ADJUSTMENTS[soil_key]

    # Organic matter adjustment
    om_factor = {"low": 1.15, "medium": 1.0, "high": 0.85}.get(
        request.organic_matter.lower() if request.organic_matter else "medium", 1.0
    )

    # pH adjustment for nutrient availability
    ph = request.soil_ph or 6.5
    ph_factor = 1.0
    ph_note = ""
    if ph < 5.5:
        ph_factor = 1.2
        ph_note = "⚠️ Soil is too acidic (pH < 5.5). Apply lime to raise pH before fertilizing."
    elif ph < 6.0:
        ph_factor = 1.1
        ph_note = "⚠️ Slightly acidic soil. Consider liming to improve nutrient availability."
    elif ph > 7.5:
        ph_factor = 1.15
        ph_note = "⚠️ Alkaline soil. Some nutrients may be locked up. Consider sulfur application."
    elif 6.0 <= ph <= 7.0:
        ph_note = "✅ Optimal pH range for most crops."

    # Calculate total NPK needed (kg)
    n_needed = round(crop_data["N"] * request.area_hectares * soil_adj["N"] * om_factor * ph_factor, 1)
    p_needed = round(crop_data["P"] * request.area_hectares * soil_adj["P"] * om_factor, 1)
    k_needed = round(crop_data["K"] * request.area_hectares * soil_adj["K"] * om_factor, 1)

    # Calculate fertilizer quantities
    recommendations = []

    # Urea for Nitrogen
    urea_kg = round(n_needed / (FERTILIZERS["Urea"]["N"] / 100), 1)
    urea_cost = round(urea_kg * FERTILIZERS["Urea"]["cost_per_kg"], 2)
    recommendations.append({
        "fertilizer": "Urea (46-0-0)",
        "purpose": "Nitrogen supply",
        "quantity_kg": urea_kg,
        "quantity_bags_50kg": round(urea_kg / 50, 1),
        "estimated_cost_usd": urea_cost,
        "application": "Split into 3 applications: at planting, 4 weeks, 8 weeks",
        "nutrient_provided": f"{n_needed} kg N",
    })

    # DAP for Phosphorus
    dap_kg = round(p_needed / (FERTILIZERS["DAP (18-46-0)"]["P"] / 100), 1)
    dap_cost = round(dap_kg * FERTILIZERS["DAP (18-46-0)"]["cost_per_kg"], 2)
    recommendations.append({
        "fertilizer": "DAP (18-46-0)",
        "purpose": "Phosphorus supply",
        "quantity_kg": dap_kg,
        "quantity_bags_50kg": round(dap_kg / 50, 1),
        "estimated_cost_usd": dap_cost,
        "application": "Apply at planting, incorporate into soil",
        "nutrient_provided": f"{p_needed} kg P₂O₅",
    })

    # MOP for Potassium
    mop_kg = round(k_needed / (FERTILIZERS["MOP (0-0-60)"]["K"] / 100), 1)
    mop_cost = round(mop_kg * FERTILIZERS["MOP (0-0-60)"]["cost_per_kg"], 2)
    recommendations.append({
        "fertilizer": "MOP (0-0-60)",
        "purpose": "Potassium supply",
        "quantity_kg": mop_kg,
        "quantity_bags_50kg": round(mop_kg / 50, 1),
        "estimated_cost_usd": mop_cost,
        "application": "Apply half at planting, half at mid-season",
        "nutrient_provided": f"{k_needed} kg K₂O",
    })

    total_cost = round(urea_cost + dap_cost + mop_cost, 2)

    return {
        "crop": crop_key,
        "emoji": crop_data["emoji"],
        "area_hectares": request.area_hectares,
        "soil_type": soil_key,
        "soil_ph": ph,
        "ph_note": ph_note,
        "soil_note": soil_adj["note"],
        "expected_yield": crop_data["yield_per_ha"],
        "npk_requirements": {
            "N_kg": n_needed,
            "P_kg": p_needed,
            "K_kg": k_needed,
        },
        "fertilizer_recommendations": recommendations,
        "total_estimated_cost_usd": total_cost,
        "cost_per_hectare_usd": round(total_cost / request.area_hectares, 2),
        "organic_alternative": {
            "compost_tonnes": round((n_needed / 15) * 1.2, 1),
            "farmyard_manure_tonnes": round((n_needed / 5) * 1.2, 1),
            "note": "Organic alternatives improve soil health long-term but require larger quantities",
        },
        "application_schedule": [
            {"timing": "At planting (Day 0)", "apply": "All DAP + Half MOP + 1/3 Urea"},
            {"timing": "4 weeks after planting", "apply": "1/3 Urea"},
            {"timing": "8 weeks after planting", "apply": "1/3 Urea + Half MOP"},
        ],
    }


@router.get("/soil-guide")
def get_soil_guide():
    """Get soil health and pH guide."""
    return {
        "ph_guide": [
            {"range": "< 5.0", "status": "Very Acidic", "effect": "Toxic aluminum/manganese, poor nutrient uptake", "action": "Apply heavy lime (4-6 tonnes/ha)"},
            {"range": "5.0-5.5", "status": "Acidic", "effect": "Reduced phosphorus availability", "action": "Apply lime (2-4 tonnes/ha)"},
            {"range": "5.5-6.0", "status": "Slightly Acidic", "effect": "Acceptable for most crops", "action": "Light lime application"},
            {"range": "6.0-7.0", "status": "Optimal", "effect": "Best nutrient availability for most crops", "action": "Maintain with organic matter"},
            {"range": "7.0-7.5", "status": "Neutral-Alkaline", "effect": "Reduced iron/manganese availability", "action": "Add organic matter, sulfur"},
            {"range": "> 7.5", "status": "Alkaline", "effect": "Micronutrient deficiencies likely", "action": "Apply sulfur, acidifying fertilizers"},
        ],
        "soil_types": [
            {"type": k, **{kk: vv for kk, vv in v.items() if kk == "note"}}
            for k, v in SOIL_ADJUSTMENTS.items()
        ],
        "deficiency_symptoms": [
            {"nutrient": "Nitrogen (N)", "symptom": "Yellowing of older leaves, stunted growth", "fix": "Apply urea or ammonium sulfate"},
            {"nutrient": "Phosphorus (P)", "symptom": "Purple/red coloration on leaves, poor root development", "fix": "Apply DAP or SSP"},
            {"nutrient": "Potassium (K)", "symptom": "Brown leaf edges (scorch), weak stems", "fix": "Apply MOP or potassium sulfate"},
            {"nutrient": "Calcium (Ca)", "symptom": "Blossom end rot in tomatoes, tip burn", "fix": "Apply lime or calcium nitrate"},
            {"nutrient": "Magnesium (Mg)", "symptom": "Interveinal chlorosis (yellowing between veins)", "fix": "Apply Epsom salt (magnesium sulfate)"},
            {"nutrient": "Iron (Fe)", "symptom": "Young leaves yellow with green veins", "fix": "Apply chelated iron, lower soil pH"},
            {"nutrient": "Zinc (Zn)", "symptom": "Small leaves, shortened internodes", "fix": "Apply zinc sulfate"},
        ]
    }
