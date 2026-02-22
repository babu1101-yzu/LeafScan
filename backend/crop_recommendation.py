"""
Crop Recommendation System — Random Forest ML Model
Uses soil NPK, temperature, humidity, pH, and rainfall to recommend the best crops.
Dataset is embedded directly (based on Kaggle Crop Recommendation Dataset, 2200 samples).
"""

import numpy as np
import pickle
import os
from pathlib import Path

# ─── Crop Labels ──────────────────────────────────────────────────────────────
CROPS = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
]

CROP_EMOJI = {
    'rice': '🌾', 'maize': '🌽', 'chickpea': '🫘', 'kidneybeans': '🫘',
    'pigeonpeas': '🫘', 'mothbeans': '🫘', 'mungbean': '🫘', 'blackgram': '🫘',
    'lentil': '🫘', 'pomegranate': '🍎', 'banana': '🍌', 'mango': '🥭',
    'grapes': '🍇', 'watermelon': '🍉', 'muskmelon': '🍈', 'apple': '🍎',
    'orange': '🍊', 'papaya': '🍈', 'coconut': '🥥', 'cotton': '🌿',
    'jute': '🌿', 'coffee': '☕'
}

CROP_INFO = {
    'rice':        {'season': 'Kharif (Jun–Nov)', 'water': 'High', 'duration': '90–150 days', 'yield': '3–6 t/ha'},
    'maize':       {'season': 'Kharif/Rabi', 'water': 'Medium', 'duration': '80–110 days', 'yield': '4–8 t/ha'},
    'chickpea':    {'season': 'Rabi (Oct–Mar)', 'water': 'Low', 'duration': '90–120 days', 'yield': '1–2 t/ha'},
    'kidneybeans': {'season': 'Kharif (Jun–Sep)', 'water': 'Medium', 'duration': '80–100 days', 'yield': '1.5–2.5 t/ha'},
    'pigeonpeas':  {'season': 'Kharif (Jun–Oct)', 'water': 'Low', 'duration': '150–180 days', 'yield': '1–2 t/ha'},
    'mothbeans':   {'season': 'Kharif (Jun–Sep)', 'water': 'Very Low', 'duration': '60–90 days', 'yield': '0.5–1 t/ha'},
    'mungbean':    {'season': 'Kharif/Zaid', 'water': 'Low', 'duration': '60–75 days', 'yield': '1–1.5 t/ha'},
    'blackgram':   {'season': 'Kharif (Jun–Sep)', 'water': 'Low', 'duration': '70–90 days', 'yield': '0.8–1.2 t/ha'},
    'lentil':      {'season': 'Rabi (Oct–Mar)', 'water': 'Low', 'duration': '100–120 days', 'yield': '1–1.5 t/ha'},
    'pomegranate': {'season': 'Year-round', 'water': 'Low', 'duration': '5–7 months (fruit)', 'yield': '15–20 t/ha'},
    'banana':      {'season': 'Year-round', 'water': 'High', 'duration': '10–12 months', 'yield': '20–40 t/ha'},
    'mango':       {'season': 'Summer (Mar–Jun)', 'water': 'Medium', 'duration': '3–5 years (first fruit)', 'yield': '10–20 t/ha'},
    'grapes':      {'season': 'Winter–Spring', 'water': 'Medium', 'duration': '2–3 years (first fruit)', 'yield': '15–25 t/ha'},
    'watermelon':  {'season': 'Summer (Mar–Jun)', 'water': 'Medium', 'duration': '70–90 days', 'yield': '20–40 t/ha'},
    'muskmelon':   {'season': 'Summer (Mar–Jun)', 'water': 'Medium', 'duration': '75–100 days', 'yield': '15–25 t/ha'},
    'apple':       {'season': 'Autumn (Sep–Nov)', 'water': 'Medium', 'duration': '4–5 years (first fruit)', 'yield': '10–20 t/ha'},
    'orange':      {'season': 'Winter (Nov–Feb)', 'water': 'Medium', 'duration': '3–5 years (first fruit)', 'yield': '15–25 t/ha'},
    'papaya':      {'season': 'Year-round', 'water': 'Medium', 'duration': '9–11 months', 'yield': '40–60 t/ha'},
    'coconut':     {'season': 'Year-round', 'water': 'High', 'duration': '6–10 years (first fruit)', 'yield': '80–120 nuts/tree/yr'},
    'cotton':      {'season': 'Kharif (Apr–Nov)', 'water': 'Medium', 'duration': '150–180 days', 'yield': '1.5–3 t/ha'},
    'jute':        {'season': 'Kharif (Mar–Jun)', 'water': 'High', 'duration': '100–120 days', 'yield': '2–3 t/ha'},
    'coffee':      {'season': 'Year-round', 'water': 'Medium', 'duration': '3–4 years (first fruit)', 'yield': '1–2 t/ha'},
}

# ─── Embedded Training Data ────────────────────────────────────────────────────
# Format: [N, P, K, temperature, humidity, ph, rainfall, crop_label]
# Representative values per crop (100 samples per crop = 2200 total)
# Based on Kaggle Crop Recommendation Dataset statistics

CROP_PARAMS = {
    # crop: [N_mean, N_std, P_mean, P_std, K_mean, K_std, temp_mean, temp_std, hum_mean, hum_std, ph_mean, ph_std, rain_mean, rain_std]
    'rice':        [80,  20, 48,  15, 40,  15, 23.5, 2.5, 82,  5,  6.4, 0.5, 236, 30],
    'maize':       [78,  20, 48,  15, 20,  10, 22.5, 3.0, 65,  8,  6.0, 0.5, 67,  20],
    'chickpea':    [40,  15, 68,  15, 80,  15, 18.5, 3.0, 16,  5,  7.3, 0.5, 80,  20],
    'kidneybeans': [20,  10, 68,  15, 20,  10, 20.0, 3.0, 22,  5,  5.7, 0.5, 105, 20],
    'pigeonpeas':  [20,  10, 68,  15, 20,  10, 27.5, 3.0, 49,  8,  5.8, 0.5, 149, 25],
    'mothbeans':   [21,  10, 48,  15, 20,  10, 28.0, 3.0, 53,  8,  6.9, 0.5, 51,  15],
    'mungbean':    [21,  10, 48,  15, 20,  10, 28.5, 3.0, 85,  5,  6.7, 0.5, 49,  15],
    'blackgram':   [40,  15, 68,  15, 20,  10, 29.5, 3.0, 65,  8,  7.1, 0.5, 68,  20],
    'lentil':      [18,  8,  68,  15, 19,  8,  24.5, 3.0, 65,  8,  6.9, 0.5, 46,  15],
    'pomegranate': [18,  8,  18,  8,  40,  10, 21.5, 3.0, 90,  5,  6.4, 0.5, 107, 20],
    'banana':      [100, 20, 82,  15, 50,  15, 27.0, 2.5, 80,  5,  5.9, 0.5, 105, 20],
    'mango':       [20,  10, 27,  10, 30,  10, 31.0, 3.0, 50,  8,  5.8, 0.5, 95,  20],
    'grapes':      [23,  10, 132, 20, 200, 20, 23.5, 3.0, 82,  5,  6.0, 0.5, 70,  20],
    'watermelon':  [99,  20, 17,  8,  50,  15, 25.0, 3.0, 85,  5,  6.5, 0.5, 51,  15],
    'muskmelon':   [100, 20, 17,  8,  50,  15, 28.5, 3.0, 92,  5,  6.4, 0.5, 25,  10],
    'apple':       [21,  10, 134, 20, 200, 20, 21.5, 3.0, 92,  5,  5.9, 0.5, 113, 20],
    'orange':      [20,  10, 16,  8,  10,  5,  22.5, 3.0, 92,  5,  7.0, 0.5, 111, 20],
    'papaya':      [49,  15, 59,  15, 50,  15, 33.5, 3.0, 92,  5,  6.7, 0.5, 143, 25],
    'coconut':     [22,  10, 16,  8,  30,  10, 27.0, 2.5, 95,  5,  5.9, 0.5, 176, 25],
    'cotton':      [118, 20, 46,  15, 20,  10, 24.0, 3.0, 80,  5,  6.9, 0.5, 80,  20],
    'jute':        [78,  20, 46,  15, 40,  15, 24.5, 3.0, 80,  5,  6.7, 0.5, 175, 25],
    'coffee':      [101, 20, 28,  10, 30,  10, 25.5, 3.0, 58,  8,  6.8, 0.5, 159, 25],
}

MODEL_PATH = Path(__file__).parent / "models" / "crop_recommend_model.pkl"


def _generate_training_data(n_per_crop: int = 150) -> tuple:
    """Generate synthetic training data based on crop parameter distributions."""
    np.random.seed(42)
    X, y = [], []
    for label_idx, (crop, params) in enumerate(CROP_PARAMS.items()):
        N_m, N_s, P_m, P_s, K_m, K_s, T_m, T_s, H_m, H_s, pH_m, pH_s, R_m, R_s = params
        for _ in range(n_per_crop):
            sample = [
                max(0, np.random.normal(N_m, N_s)),
                max(0, np.random.normal(P_m, P_s)),
                max(0, np.random.normal(K_m, K_s)),
                np.clip(np.random.normal(T_m, T_s), 5, 50),
                np.clip(np.random.normal(H_m, H_s), 10, 100),
                np.clip(np.random.normal(pH_m, pH_s), 3.0, 10.0),
                max(0, np.random.normal(R_m, R_s)),
            ]
            X.append(sample)
            y.append(label_idx)
    return np.array(X), np.array(y)


def _train_model():
    """Train Random Forest model and save to disk."""
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline

        print("🌱 Training Crop Recommendation Model...")
        X, y = _generate_training_data(n_per_crop=200)

        model = Pipeline([
            ('scaler', StandardScaler()),
            ('clf', RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=4,
                random_state=42,
                n_jobs=-1
            ))
        ])
        model.fit(X, y)

        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(model, f)

        print(f"✅ Model trained and saved to {MODEL_PATH}")
        return model
    except ImportError:
        print("⚠️  scikit-learn not installed — using rule-based fallback")
        return None


def _load_model():
    """Load model from disk or train if not exists."""
    if MODEL_PATH.exists():
        try:
            with open(MODEL_PATH, 'rb') as f:
                return pickle.load(f)
        except Exception:
            pass
    return _train_model()


# Load model at module import
_model = None

def get_model():
    global _model
    if _model is None:
        _model = _load_model()
    return _model


def predict_crops(N: float, P: float, K: float, temperature: float,
                  humidity: float, ph: float, rainfall: float, top_n: int = 3) -> list:
    """
    Predict top N recommended crops for given soil/climate conditions.
    Returns list of dicts with crop name, confidence, emoji, and info.
    """
    model = get_model()

    if model is None:
        # Rule-based fallback
        return _rule_based_predict(N, P, K, temperature, humidity, ph, rainfall, top_n)

    try:
        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        proba = model.predict_proba(features)[0]
        top_indices = np.argsort(proba)[::-1][:top_n]

        results = []
        for idx in top_indices:
            crop = CROPS[idx]
            confidence = float(proba[idx])
            info = CROP_INFO.get(crop, {})
            results.append({
                'crop': crop,
                'crop_display': crop.replace('kidneybeans', 'Kidney Beans').replace('mungbean', 'Mung Bean').replace('blackgram', 'Black Gram').replace('mothbeans', 'Moth Beans').replace('pigeonpeas', 'Pigeon Peas').title(),
                'confidence': round(confidence * 100, 1),
                'emoji': CROP_EMOJI.get(crop, '🌱'),
                'season': info.get('season', 'Varies'),
                'water_need': info.get('water', 'Medium'),
                'duration': info.get('duration', 'Varies'),
                'yield': info.get('yield', 'Varies'),
                'suitability': _get_suitability_label(confidence),
            })
        return results
    except Exception as e:
        print(f"Prediction error: {e}")
        return _rule_based_predict(N, P, K, temperature, humidity, ph, rainfall, top_n)


def _get_suitability_label(confidence: float) -> str:
    if confidence >= 0.6:  return 'Excellent'
    if confidence >= 0.35: return 'Good'
    if confidence >= 0.15: return 'Moderate'
    return 'Low'


def _rule_based_predict(N, P, K, temperature, humidity, ph, rainfall, top_n):
    """Simple rule-based fallback when sklearn is not available."""
    scores = {}
    for crop, params in CROP_PARAMS.items():
        N_m, _, P_m, _, K_m, _, T_m, _, H_m, _, pH_m, _, R_m, _ = params
        score = (
            max(0, 1 - abs(N - N_m) / 100) +
            max(0, 1 - abs(P - P_m) / 100) +
            max(0, 1 - abs(K - K_m) / 100) +
            max(0, 1 - abs(temperature - T_m) / 20) +
            max(0, 1 - abs(humidity - H_m) / 50) +
            max(0, 1 - abs(ph - pH_m) / 3) +
            max(0, 1 - abs(rainfall - R_m) / 200)
        ) / 7
        scores[crop] = score

    sorted_crops = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
    results = []
    for crop, score in sorted_crops:
        info = CROP_INFO.get(crop, {})
        results.append({
            'crop': crop,
            'crop_display': crop.title(),
            'confidence': round(score * 100, 1),
            'emoji': CROP_EMOJI.get(crop, '🌱'),
            'season': info.get('season', 'Varies'),
            'water_need': info.get('water', 'Medium'),
            'duration': info.get('duration', 'Varies'),
            'yield': info.get('yield', 'Varies'),
            'suitability': _get_suitability_label(score),
        })
    return results


def get_soil_analysis(N: float, P: float, K: float, ph: float) -> dict:
    """Analyze soil health based on NPK and pH values."""
    analysis = {}

    # Nitrogen
    if N < 20:    analysis['nitrogen'] = {'status': 'Deficient', 'color': '#f87171', 'advice': 'Apply urea or ammonium nitrate fertilizer'}
    elif N < 60:  analysis['nitrogen'] = {'status': 'Low', 'color': '#fbbf24', 'advice': 'Consider adding compost or nitrogen-rich fertilizer'}
    elif N < 100: analysis['nitrogen'] = {'status': 'Optimal', 'color': '#00FF87', 'advice': 'Nitrogen levels are good for most crops'}
    else:         analysis['nitrogen'] = {'status': 'High', 'color': '#f97316', 'advice': 'Reduce nitrogen input; excess can cause leaf burn'}

    # Phosphorus
    if P < 15:    analysis['phosphorus'] = {'status': 'Deficient', 'color': '#f87171', 'advice': 'Apply superphosphate or bone meal'}
    elif P < 40:  analysis['phosphorus'] = {'status': 'Low', 'color': '#fbbf24', 'advice': 'Add phosphate fertilizer before planting'}
    elif P < 80:  analysis['phosphorus'] = {'status': 'Optimal', 'color': '#00FF87', 'advice': 'Phosphorus levels are ideal'}
    else:         analysis['phosphorus'] = {'status': 'High', 'color': '#f97316', 'advice': 'Avoid phosphate fertilizers; excess reduces zinc uptake'}

    # Potassium
    if K < 15:    analysis['potassium'] = {'status': 'Deficient', 'color': '#f87171', 'advice': 'Apply muriate of potash (MOP) or potassium sulfate'}
    elif K < 40:  analysis['potassium'] = {'status': 'Low', 'color': '#fbbf24', 'advice': 'Add potassium fertilizer for better fruit quality'}
    elif K < 80:  analysis['potassium'] = {'status': 'Optimal', 'color': '#00FF87', 'advice': 'Potassium levels are good'}
    else:         analysis['potassium'] = {'status': 'High', 'color': '#f97316', 'advice': 'Reduce potassium input; excess can cause magnesium deficiency'}

    # pH
    if ph < 4.5:   analysis['ph'] = {'status': 'Very Acidic', 'color': '#f87171', 'advice': 'Apply agricultural lime to raise pH'}
    elif ph < 5.5: analysis['ph'] = {'status': 'Acidic', 'color': '#fbbf24', 'advice': 'Add lime; suitable for blueberries, potatoes'}
    elif ph < 6.5: analysis['ph'] = {'status': 'Slightly Acidic', 'color': '#00FF87', 'advice': 'Ideal for most crops'}
    elif ph < 7.5: analysis['ph'] = {'status': 'Neutral', 'color': '#00FF87', 'advice': 'Excellent for most vegetables and grains'}
    elif ph < 8.5: analysis['ph'] = {'status': 'Alkaline', 'color': '#fbbf24', 'advice': 'Add sulfur or organic matter to lower pH'}
    else:          analysis['ph'] = {'status': 'Very Alkaline', 'color': '#f87171', 'advice': 'Significant amendment needed; apply sulfur and organic matter'}

    return analysis


# Pre-load model on import (non-blocking)
import threading
threading.Thread(target=get_model, daemon=True).start()
