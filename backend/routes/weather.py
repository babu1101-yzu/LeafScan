from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx
import os
import math
from datetime import datetime

router = APIRouter(prefix="/api/weather", tags=["Weather"])

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE   = "https://api.openweathermap.org/data/2.5"
OPENWEATHER_UV     = "https://api.openweathermap.org/data/3.0/onecall"

# ─── Agricultural Alert Engine ────────────────────────────────────────────────

def generate_agricultural_alerts(weather: dict, forecast_list: list = None) -> list:
    """Generate comprehensive agricultural alerts from current + forecast data."""
    alerts = []
    temp        = weather.get("main", {}).get("temp", 20)
    humidity    = weather.get("main", {}).get("humidity", 50)
    wind_speed  = weather.get("wind", {}).get("speed", 0)
    pressure    = weather.get("main", {}).get("pressure", 1013)
    weather_id  = weather.get("weather", [{}])[0].get("id", 800)
    rain_1h     = weather.get("rain", {}).get("1h", 0)
    rain_3h     = weather.get("rain", {}).get("3h", 0)

    # ── Temperature alerts ──────────────────────────────────────────────────
    if temp < 0:
        alerts.append({
            "type": "frost", "severity": "critical",
            "message": f"🧊 Hard Frost Alert! {temp:.1f}°C — Cover all crops immediately. Bring potted plants indoors. Protect irrigation pipes."
        })
    elif temp < 2:
        alerts.append({
            "type": "frost", "severity": "critical",
            "message": f"❄️ Frost Alert! {temp:.1f}°C — Protect sensitive crops with row covers or frost cloth. Harvest ripe produce now."
        })
    elif temp < 5:
        alerts.append({
            "type": "cold", "severity": "warning",
            "message": f"🌡️ Cold Warning: {temp:.1f}°C — Monitor frost-sensitive crops overnight. Delay transplanting seedlings."
        })
    elif temp > 40:
        alerts.append({
            "type": "extreme_heat", "severity": "critical",
            "message": f"🔥 Extreme Heat! {temp:.1f}°C — Irrigate immediately. Apply shade cloth. Harvest heat-sensitive crops early morning."
        })
    elif temp > 35:
        alerts.append({
            "type": "heat", "severity": "warning",
            "message": f"☀️ Heat Stress: {temp:.1f}°C — Increase irrigation frequency. Mulch to retain soil moisture. Avoid midday field work."
        })

    # ── Humidity alerts ─────────────────────────────────────────────────────
    if humidity < 20:
        alerts.append({
            "type": "drought", "severity": "critical",
            "message": f"🏜️ Severe Drought Risk! Humidity {humidity}% — Irrigate immediately. Apply heavy mulch. Check for wilting."
        })
    elif humidity < 35 and weather_id >= 800:
        alerts.append({
            "type": "drought", "severity": "warning",
            "message": f"💧 Low Humidity ({humidity}%) — Increase irrigation. Mulch soil to reduce evaporation. Monitor for drought stress."
        })
    elif humidity > 90:
        alerts.append({
            "type": "disease_risk", "severity": "critical",
            "message": f"🍄 Critical Disease Risk! Humidity {humidity}% — Apply preventive fungicides NOW. Improve air circulation. Avoid overhead irrigation."
        })
    elif humidity > 80:
        alerts.append({
            "type": "disease_risk", "severity": "warning",
            "message": f"🌫️ High Humidity ({humidity}%) — Conditions favor fungal diseases (blight, mildew). Apply preventive fungicides. Ensure good drainage."
        })

    # ── Precipitation alerts ────────────────────────────────────────────────
    if weather_id in range(200, 233):
        alerts.append({
            "type": "storm", "severity": "critical",
            "message": "⛈️ Thunderstorm Alert — Secure equipment and greenhouses. Delay all field operations. Check for hail damage after storm."
        })
    elif weather_id in range(511, 512):
        alerts.append({
            "type": "freezing_rain", "severity": "critical",
            "message": "🌨️ Freezing Rain Alert — Protect crops from ice damage. Avoid field operations. Check greenhouse heating."
        })
    elif weather_id in range(500, 532):
        if rain_1h > 20 or rain_3h > 40:
            alerts.append({
                "type": "heavy_rain", "severity": "warning",
                "message": f"🌧️ Heavy Rain ({rain_1h:.1f}mm/h) — Risk of waterlogging and soil erosion. Check field drainage. Delay pesticide application."
            })
        else:
            alerts.append({
                "type": "rain", "severity": "info",
                "message": "🌦️ Rain detected — Delay pesticide/fertilizer application by 24h. Good time to check irrigation systems."
            })
    elif weather_id in range(600, 623):
        alerts.append({
            "type": "snow", "severity": "warning",
            "message": "❄️ Snow Alert — Protect crops with covers. Remove heavy snow from greenhouse roofs. Delay field operations."
        })

    # ── Wind alerts ─────────────────────────────────────────────────────────
    if wind_speed > 17:
        alerts.append({
            "type": "wind", "severity": "critical",
            "message": f"🌪️ Strong Wind Warning ({wind_speed:.1f} m/s) — Secure all structures. Do NOT spray. Stake tall crops. Check greenhouse integrity."
        })
    elif wind_speed > 10:
        alerts.append({
            "type": "wind", "severity": "warning",
            "message": f"💨 High Wind ({wind_speed:.1f} m/s) — Delay spraying operations. Secure row covers and shade cloth."
        })

    # ── Pressure alerts (storm approaching) ────────────────────────────────
    if pressure < 990:
        alerts.append({
            "type": "low_pressure", "severity": "warning",
            "message": f"📉 Low Pressure ({pressure} hPa) — Storm system approaching. Prepare crops for adverse weather in the next 24-48 hours."
        })

    # ── Optimal conditions ──────────────────────────────────────────────────
    if not alerts and 15 <= temp <= 28 and 40 <= humidity <= 70 and wind_speed < 5:
        alerts.append({
            "type": "optimal", "severity": "info",
            "message": "✅ Excellent growing conditions! Ideal temperature and humidity for most crops. Great day for planting, spraying, or harvesting."
        })
    elif not alerts:
        alerts.append({
            "type": "normal", "severity": "info",
            "message": f"🌿 Normal conditions — {temp:.1f}°C, {humidity}% humidity. Monitor crops regularly and maintain standard care routines."
        })

    return alerts


def estimate_soil_temperature(air_temp: float, humidity: float, cloud_cover: int) -> float:
    """Estimate soil temperature from air temperature (simplified model)."""
    # Soil temp is typically 2-5°C lower than air temp in daytime
    cloud_factor = cloud_cover / 100.0
    soil_temp = air_temp - (2.5 * (1 - cloud_factor)) - (humidity / 100.0)
    return round(soil_temp, 1)


def get_farming_advice(temp: float, humidity: float, weather_id: int, wind_speed: float = 0) -> dict:
    """Generate farming activity recommendations based on weather."""
    advice = {
        "irrigation": "",
        "spraying": "",
        "planting": "",
        "harvesting": "",
        "overall": ""
    }

    # Irrigation advice
    if temp > 30 and humidity < 50:
        advice["irrigation"] = "🚿 Irrigate today — high evapotranspiration. Water deeply in early morning or evening."
    elif weather_id in range(500, 532):
        advice["irrigation"] = "⏸️ Skip irrigation — natural rainfall is sufficient today."
    else:
        advice["irrigation"] = "💧 Check soil moisture before irrigating. Water when top 2 inches are dry."

    # Spraying advice
    if weather_id in range(200, 532):
        advice["spraying"] = "❌ Do NOT spray — rain will wash off chemicals. Wait 24h after rain."
    elif humidity > 85:
        advice["spraying"] = "⚠️ Avoid spraying — high humidity reduces effectiveness and increases disease spread risk."
    elif wind_speed > 10:
        advice["spraying"] = "💨 Delay spraying — wind speed too high. Wait for calm conditions (< 10 m/s)."
    else:
        advice["spraying"] = "✅ Good spraying conditions. Apply in early morning when wind is calm."

    # Planting advice
    if temp < 10:
        advice["planting"] = "❄️ Too cold for most transplanting. Wait for warmer conditions."
    elif temp > 35:
        advice["planting"] = "🌡️ Too hot for transplanting. Wait for cooler weather or plant in late afternoon."
    elif weather_id in range(200, 532):
        advice["planting"] = "🌧️ Rainy conditions — good for transplanting if not waterlogged."
    else:
        advice["planting"] = "✅ Good planting conditions. Ensure adequate soil moisture before transplanting."

    # Harvesting advice
    if weather_id in range(200, 532):
        advice["harvesting"] = "🌧️ Harvest before rain if possible. Wet conditions increase post-harvest disease risk."
    elif temp > 30:
        advice["harvesting"] = "🌅 Harvest in early morning to preserve quality and reduce field heat."
    else:
        advice["harvesting"] = "✅ Good harvesting conditions. Harvest in morning for best quality."

    # Overall summary
    if 15 <= temp <= 28 and 40 <= humidity <= 70 and wind_speed < 5 and weather_id >= 800:
        advice["overall"] = "🌟 Excellent day for all farm activities!"
    elif weather_id in range(200, 233):
        advice["overall"] = "⛈️ Storm conditions — stay safe and secure your farm."
    elif weather_id in range(500, 532):
        advice["overall"] = "🌧️ Rainy day — focus on indoor tasks and drainage management."
    else:
        advice["overall"] = "🌿 Moderate conditions — proceed with standard farm activities."

    return advice


def build_mock_response(city: str, reason: str = "no_key") -> dict:
    """Return realistic mock weather data when no API key is configured or key is invalid."""
    note_msg = (
        "ℹ️ Add your OpenWeatherMap API key in backend/.env to get real-time weather data for your location."
        if reason == "no_key"
        else "⏳ OpenWeatherMap API key not yet activated (new keys take up to 2 hours). Using demo data."
    )
    return {
        "city": city,
        "country": "KE",
        "demo_mode": True,
        "demo_reason": reason,
        "temperature": 24.5,
        "feels_like": 23.8,
        "humidity": 65,
        "wind_speed": 3.2,
        "wind_direction": "NE",
        "description": "Partly cloudy",
        "icon": "02d",
        "pressure": 1013,
        "visibility": 10,
        "uv_index": 6,
        "cloud_cover": 30,
        "soil_temperature": 22.1,
        "dew_point": 17.5,
        "sunrise": "06:15",
        "sunset": "18:45",
        "api_source": "mock",
        "alerts": [
            {
                "type": "optimal",
                "severity": "info",
                "message": "✅ Good growing conditions — 24.5°C, 65% humidity. Ideal for most crops today."
            },
            {
                "type": "info",
                "severity": "info",
                "message": note_msg
            }
        ],
        "farming_advice": {
            "irrigation": "💧 Check soil moisture before irrigating. Water when top 2 inches are dry.",
            "spraying": "✅ Good spraying conditions. Apply in early morning when wind is calm.",
            "planting": "✅ Good planting conditions. Ensure adequate soil moisture before transplanting.",
            "harvesting": "✅ Good harvesting conditions. Harvest in morning for best quality.",
            "overall": "🌟 Excellent day for all farm activities!"
        },
        "forecast": [
            {"day": "Today",     "date": "Mon", "high": 26, "low": 18, "icon": "02d", "description": "Partly cloudy", "humidity": 65, "rain_chance": 10},
            {"day": "Tomorrow",  "date": "Tue", "high": 28, "low": 19, "icon": "01d", "description": "Sunny",         "humidity": 55, "rain_chance": 5},
            {"day": "Wednesday", "date": "Wed", "high": 22, "low": 16, "icon": "10d", "description": "Light rain",    "humidity": 80, "rain_chance": 70},
            {"day": "Thursday",  "date": "Thu", "high": 25, "low": 17, "icon": "03d", "description": "Cloudy",        "humidity": 72, "rain_chance": 30},
            {"day": "Friday",    "date": "Fri", "high": 27, "low": 18, "icon": "01d", "description": "Sunny",         "humidity": 58, "rain_chance": 5},
            {"day": "Saturday",  "date": "Sat", "high": 29, "low": 20, "icon": "01d", "description": "Clear sky",     "humidity": 50, "rain_chance": 0},
            {"day": "Sunday",    "date": "Sun", "high": 24, "low": 17, "icon": "04d", "description": "Overcast",      "humidity": 75, "rain_chance": 40},
        ]
    }


@router.get("/current")
async def get_current_weather(
    city: str = Query("Nairobi", description="City name"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
):
    """Get current weather with comprehensive agricultural alerts and farming advice."""

    if not OPENWEATHER_API_KEY:
        return build_mock_response(city, reason="no_key")

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            # Build URL
            if lat is not None and lon is not None:
                current_url  = f"{OPENWEATHER_BASE}/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
                forecast_url = f"{OPENWEATHER_BASE}/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=40"
            else:
                current_url  = f"{OPENWEATHER_BASE}/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
                forecast_url = f"{OPENWEATHER_BASE}/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=40"

            # Fetch current weather
            resp = await client.get(current_url)
            if resp.status_code == 401:
                # Key exists but not yet activated — fall back to mock data gracefully
                return build_mock_response(city, reason="key_pending")
            if resp.status_code == 404:
                raise HTTPException(status_code=404, detail=f"City '{city}' not found")
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail=f"Weather API error: {resp.status_code}")

            data = resp.json()

            # Fetch 7-day forecast
            forecast_resp = await client.get(forecast_url)
            forecast_data = []
            if forecast_resp.status_code == 200:
                forecast_json = forecast_resp.json()
                # Group by day (API returns 3h intervals)
                day_map = {}
                day_names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                for item in forecast_json.get("list", []):
                    dt = datetime.fromtimestamp(item["dt"])
                    day_key = dt.strftime("%Y-%m-%d")
                    if day_key not in day_map:
                        day_map[day_key] = {
                            "day": day_names[dt.weekday()] if len(day_map) > 0 else "Today",
                            "date": dt.strftime("%a"),
                            "temps": [],
                            "icons": [],
                            "descriptions": [],
                            "humidities": [],
                            "rain_chances": [],
                        }
                    day_map[day_key]["temps"].append(item["main"]["temp"])
                    day_map[day_key]["icons"].append(item["weather"][0]["icon"])
                    day_map[day_key]["descriptions"].append(item["weather"][0]["description"])
                    day_map[day_key]["humidities"].append(item["main"]["humidity"])
                    pop = item.get("pop", 0)  # probability of precipitation
                    day_map[day_key]["rain_chances"].append(round(pop * 100))

                for i, (day_key, day_data) in enumerate(list(day_map.items())[:7]):
                    forecast_data.append({
                        "day": "Today" if i == 0 else "Tomorrow" if i == 1 else day_data["day"],
                        "date": day_data["date"],
                        "high": round(max(day_data["temps"])),
                        "low": round(min(day_data["temps"])),
                        "icon": day_data["icons"][len(day_data["icons"])//2],
                        "description": day_data["descriptions"][len(day_data["descriptions"])//2].capitalize(),
                        "humidity": round(sum(day_data["humidities"]) / len(day_data["humidities"])),
                        "rain_chance": max(day_data["rain_chances"]),
                    })

            # Generate alerts
            alerts = generate_agricultural_alerts(data, forecast_data)

            # Extract fields
            clouds     = data.get("clouds", {}).get("all", 0)
            visibility = round(data.get("visibility", 10000) / 1000, 1)  # convert to km
            soil_temp  = estimate_soil_temperature(
                data["main"]["temp"], data["main"]["humidity"], clouds
            )

            # Sunrise/sunset
            sunrise_ts = data.get("sys", {}).get("sunrise", 0)
            sunset_ts  = data.get("sys", {}).get("sunset", 0)
            sunrise_str = datetime.fromtimestamp(sunrise_ts).strftime("%H:%M") if sunrise_ts else "N/A"
            sunset_str  = datetime.fromtimestamp(sunset_ts).strftime("%H:%M") if sunset_ts else "N/A"

            # Dew point (Magnus formula)
            T = data["main"]["temp"]
            RH = data["main"]["humidity"]
            a, b = 17.27, 237.7
            alpha = ((a * T) / (b + T)) + math.log(RH / 100.0)
            dew_point = round((b * alpha) / (a - alpha), 1)

            # Wind direction
            wind_deg = data.get("wind", {}).get("deg", 0)
            directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
            wind_dir = directions[round(wind_deg / 22.5) % 16]

            return {
                "city":            data.get("name", city),
                "country":         data.get("sys", {}).get("country", ""),
                "temperature":     round(data["main"]["temp"], 1),
                "feels_like":      round(data["main"]["feels_like"], 1),
                "temp_min":        round(data["main"]["temp_min"], 1),
                "temp_max":        round(data["main"]["temp_max"], 1),
                "humidity":        data["main"]["humidity"],
                "wind_speed":      round(data["wind"]["speed"], 1),
                "wind_direction":  wind_dir,
                "wind_gust":       round(data.get("wind", {}).get("gust", 0), 1),
                "description":     data["weather"][0]["description"].capitalize(),
                "icon":            data["weather"][0]["icon"],
                "pressure":        data["main"]["pressure"],
                "visibility":      visibility,
                "cloud_cover":     clouds,
                "soil_temperature": soil_temp,
                "dew_point":       dew_point,
                "sunrise":         sunrise_str,
                "sunset":          sunset_str,
                "uv_index":        None,  # requires One Call API (paid tier)
                "api_source":      "openweathermap",
                "alerts":          alerts,
                "farming_advice":  get_farming_advice(T, RH, data["weather"][0]["id"], data["wind"]["speed"]),
                "forecast":        forecast_data,
            }

    except HTTPException:
        raise
    except httpx.TimeoutException:
        # Timeout — fall back to mock data
        return build_mock_response(city, reason="timeout")
    except Exception as e:
        # Any other error — fall back to mock data
        return build_mock_response(city, reason="error")


@router.get("/status")
def weather_status():
    """Check weather API configuration status."""
    has_key = bool(OPENWEATHER_API_KEY)
    return {
        "api_configured": has_key,
        "mode": "Live OpenWeatherMap API" if has_key else "Mock Data (no API key)",
        "setup_instructions": (
            "1. Get a free API key at https://openweathermap.org/api\n"
            "2. Add OPENWEATHER_API_KEY=your_key to backend/.env\n"
            "3. Restart the backend server"
        ) if not has_key else "API key is configured and active.",
        "api_key_preview": f"{OPENWEATHER_API_KEY[:8]}..." if has_key else None,
    }
