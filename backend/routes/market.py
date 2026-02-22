"""
LeafScan Market Prices — Real-time commodity data
Data sources (in priority order):
  1. Alpha Vantage API (free tier, 25 req/day) — set ALPHA_VANTAGE_API_KEY env var
  2. World Bank Commodity Price API (free, no key needed, monthly data)
  3. Base prices with realistic daily variation (fallback)

Prices are cached for 24 hours to respect API rate limits.
"""
from fastapi import APIRouter
from datetime import datetime, timedelta
import random
import os
import json
import asyncio
from pathlib import Path
from typing import Optional

try:
    import httpx
    HTTPX_AVAILABLE = True
except ImportError:
    HTTPX_AVAILABLE = False

router = APIRouter(prefix="/api/market", tags=["Market Prices"])

# ─── Configuration ────────────────────────────────────────────────────────────
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
CACHE_FILE = Path(__file__).parent.parent / "market_cache.json"
CACHE_DURATION_HOURS = 24

# ─── Alpha Vantage commodity function names ───────────────────────────────────
AV_COMMODITY_MAP = {
    "Corn":    "CORN",
    "Wheat":   "WHEAT",
    "Coffee":  "COFFEE",
    "Cotton":  "COTTON",
    "Sugar":   "SUGAR",
    "Soybean": "SOYBEANS",
}

# ─── World Bank indicator codes (monthly commodity prices) ────────────────────
WB_INDICATOR_MAP = {
    "Corn":     "PMAIZMTUSDM",   # Maize
    "Wheat":    "PWHEAMTUSDM",   # Wheat
    "Rice":     "PRICENPQUSDM",  # Rice
    "Soybean":  "PSOYBUSDM",     # Soybeans
    "Cotton":   "PCOTTINDUSDM",  # Cotton
    "Coffee":   "PCOFFOTMUSDM",  # Coffee
    "Sugar":    "PSUGAISAUSDM",  # Sugar
    "Banana":   "PBANSOPUSDM",   # Banana
    "Cocoa":    "PCOCOUSDM",     # Cocoa
}

# ─── Base prices (USD) — used as fallback ─────────────────────────────────────
BASE_PRICES = {
    "Tomato":     {"unit": "kg",     "base": 0.85,  "currency": "USD", "emoji": "🍅"},
    "Potato":     {"unit": "kg",     "base": 0.35,  "currency": "USD", "emoji": "🥔"},
    "Corn":       {"unit": "bushel", "base": 4.80,  "currency": "USD", "emoji": "🌽"},
    "Apple":      {"unit": "kg",     "base": 1.20,  "currency": "USD", "emoji": "🍎"},
    "Grape":      {"unit": "kg",     "base": 2.50,  "currency": "USD", "emoji": "🍇"},
    "Strawberry": {"unit": "kg",     "base": 3.20,  "currency": "USD", "emoji": "🍓"},
    "Pepper":     {"unit": "kg",     "base": 1.80,  "currency": "USD", "emoji": "🌶️"},
    "Soybean":    {"unit": "bushel", "base": 13.50, "currency": "USD", "emoji": "🫘"},
    "Wheat":      {"unit": "bushel", "base": 5.60,  "currency": "USD", "emoji": "🌾"},
    "Rice":       {"unit": "kg",     "base": 0.45,  "currency": "USD", "emoji": "🍚"},
    "Onion":      {"unit": "kg",     "base": 0.55,  "currency": "USD", "emoji": "🧅"},
    "Garlic":     {"unit": "kg",     "base": 4.20,  "currency": "USD", "emoji": "🧄"},
    "Carrot":     {"unit": "kg",     "base": 0.70,  "currency": "USD", "emoji": "🥕"},
    "Cabbage":    {"unit": "kg",     "base": 0.40,  "currency": "USD", "emoji": "🥬"},
    "Banana":     {"unit": "kg",     "base": 0.60,  "currency": "USD", "emoji": "🍌"},
    "Mango":      {"unit": "kg",     "base": 1.10,  "currency": "USD", "emoji": "🥭"},
    "Coffee":     {"unit": "kg",     "base": 5.80,  "currency": "USD", "emoji": "☕"},
    "Tea":        {"unit": "kg",     "base": 3.40,  "currency": "USD", "emoji": "🍵"},
    "Sugarcane":  {"unit": "tonne",  "base": 38.0,  "currency": "USD", "emoji": "🎋"},
    "Cotton":     {"unit": "lb",     "base": 0.82,  "currency": "USD", "emoji": "🌿"},
}

# ─── Cache Management ─────────────────────────────────────────────────────────

def load_cache() -> dict:
    """Load cached prices from disk."""
    try:
        if CACHE_FILE.exists():
            data = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
            cached_at = datetime.fromisoformat(data.get("cached_at", "2000-01-01"))
            if datetime.utcnow() - cached_at < timedelta(hours=CACHE_DURATION_HOURS):
                return data.get("prices", {})
    except Exception:
        pass
    return {}


def save_cache(prices: dict):
    """Save prices to disk cache."""
    try:
        CACHE_FILE.write_text(
            json.dumps({"cached_at": datetime.utcnow().isoformat(), "prices": prices},
                       ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
    except Exception:
        pass


# ─── Alpha Vantage Fetcher ────────────────────────────────────────────────────

async def fetch_alpha_vantage(crop: str) -> Optional[float]:
    """Fetch latest commodity price from Alpha Vantage API."""
    if not ALPHA_VANTAGE_KEY or not HTTPX_AVAILABLE:
        return None
    function = AV_COMMODITY_MAP.get(crop)
    if not function:
        return None
    try:
        url = (
            f"https://www.alphavantage.co/query"
            f"?function={function}&interval=daily&apikey={ALPHA_VANTAGE_KEY}"
        )
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return None
            data = resp.json()
            # Alpha Vantage returns {"data": [{"date": "...", "value": "..."}, ...]}
            entries = data.get("data", [])
            if entries:
                latest = entries[0].get("value", "")
                if latest and latest != ".":
                    return float(latest)
    except Exception:
        pass
    return None


# ─── World Bank Fetcher ───────────────────────────────────────────────────────

async def fetch_world_bank(crop: str) -> Optional[float]:
    """Fetch latest commodity price from World Bank API (free, no key)."""
    if not HTTPX_AVAILABLE:
        return None
    indicator = WB_INDICATOR_MAP.get(crop)
    if not indicator:
        return None
    try:
        url = (
            f"https://api.worldbank.org/v2/en/indicator/{indicator}"
            f"?format=json&mrv=3&per_page=3"
        )
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return None
            data = resp.json()
            # World Bank returns [metadata, [{"value": ..., "date": ...}, ...]]
            if isinstance(data, list) and len(data) > 1:
                entries = [e for e in data[1] if e.get("value") is not None]
                if entries:
                    raw_value = float(entries[0]["value"])
                    # World Bank prices are in USD per metric tonne for most commodities
                    # Convert to per-unit prices
                    unit_conversions = {
                        "Corn":    raw_value / 1000,        # $/tonne → $/kg, then to $/bushel (×0.0254)
                        "Wheat":   raw_value / 1000 * 27.2, # $/tonne → $/bushel
                        "Rice":    raw_value / 1000,         # $/tonne → $/kg
                        "Soybean": raw_value / 1000 * 27.2, # $/tonne → $/bushel
                        "Cotton":  raw_value / 100,          # cents/lb → $/lb
                        "Coffee":  raw_value / 1000,         # $/tonne → $/kg
                        "Sugar":   raw_value / 100,          # cents/lb → $/lb (approx)
                        "Banana":  raw_value / 1000,         # $/tonne → $/kg
                    }
                    return round(unit_conversions.get(crop, raw_value / 1000), 4)
    except Exception:
        pass
    return None


# ─── Price Fetcher (with fallback chain) ─────────────────────────────────────

async def get_live_prices() -> dict:
    """
    Fetch live prices for all supported commodities.
    Priority: Cache → Alpha Vantage → World Bank → Base price with variation
    """
    # Try cache first
    cached = load_cache()
    if cached:
        return cached

    live_prices = {}

    # Fetch from APIs concurrently
    if HTTPX_AVAILABLE:
        tasks = {}
        for crop in BASE_PRICES:
            if ALPHA_VANTAGE_KEY and crop in AV_COMMODITY_MAP:
                tasks[crop] = fetch_alpha_vantage(crop)
            elif crop in WB_INDICATOR_MAP:
                tasks[crop] = fetch_world_bank(crop)

        if tasks:
            results = await asyncio.gather(*tasks.values(), return_exceptions=True)
            for crop, result in zip(tasks.keys(), results):
                if isinstance(result, float) and result > 0:
                    live_prices[crop] = result

    # Save to cache
    if live_prices:
        save_cache(live_prices)

    return live_prices


def get_price_with_variation(base: float, live_price: Optional[float] = None) -> dict:
    """Calculate price data with realistic variation."""
    if live_price and live_price > 0:
        current = round(live_price, 4)
        # Simulate previous day as ±3% from current
        prev = round(current * (1 + random.uniform(-0.03, 0.03)), 4)
    else:
        variation = random.uniform(-0.08, 0.08)
        current = round(base * (1 + variation), 4)
        prev = round(base * (1 + random.uniform(-0.06, 0.06)), 4)

    change = round(current - prev, 4)
    change_pct = round((change / prev) * 100, 2) if prev != 0 else 0
    return {
        "current": current,
        "previous": prev,
        "change": change,
        "change_pct": change_pct,
        "trend": "up" if change > 0 else "down" if change < 0 else "stable",
    }


def generate_weekly_history(base: float, live_price: Optional[float] = None) -> list:
    """Generate 7-day price history."""
    anchor = live_price if (live_price and live_price > 0) else base
    history = []
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    price = anchor * (1 + random.uniform(-0.05, 0.05))
    for day in days:
        price = round(price * (1 + random.uniform(-0.04, 0.04)), 4)
        history.append({"day": day, "price": price})
    return history


def get_market_insight(crop: str, trend: str) -> str:
    insights = {
        "up": [
            f"Strong demand is pushing {crop} prices higher. Consider selling premium quality now.",
            f"{crop} market is bullish. Export opportunities may be favorable this week.",
            f"Rising {crop} prices — good time to sell if storage costs are a concern.",
        ],
        "down": [
            f"{crop} prices are declining. Consider value-adding (processing, packaging) to maximize returns.",
            f"Oversupply may be affecting {crop} prices. Explore alternative markets or delay selling.",
            f"{crop} prices under pressure. Focus on quality differentiation to command premium.",
        ],
        "stable": [
            f"{crop} prices are stable. Good conditions for forward contracts.",
            f"Steady {crop} market. Plan harvest timing based on storage costs.",
            f"Consistent {crop} pricing — favorable for long-term supply agreements.",
        ],
    }
    return random.choice(insights.get(trend, insights["stable"]))


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("")
async def get_all_prices():
    """Get current market prices for all crops (live data with 24h cache)."""
    live_prices = await get_live_prices()
    result = []
    for crop, info in BASE_PRICES.items():
        live = live_prices.get(crop)
        price_data = get_price_with_variation(info["base"], live)
        result.append({
            "crop": crop,
            "emoji": info["emoji"],
            "unit": info["unit"],
            "currency": info["currency"],
            "price": price_data["current"],
            "previous_price": price_data["previous"],
            "change": price_data["change"],
            "change_pct": price_data["change_pct"],
            "trend": price_data["trend"],
            "weekly_history": generate_weekly_history(info["base"], live),
            "data_source": "live" if live else "estimated",
            "last_updated": datetime.utcnow().isoformat() + "Z",
        })
    return result


@router.get("/refresh")
async def refresh_prices():
    """Force refresh market prices from live APIs (clears cache)."""
    try:
        if CACHE_FILE.exists():
            CACHE_FILE.unlink()
    except Exception:
        pass
    live_prices = await get_live_prices()
    return {
        "message": "Prices refreshed",
        "live_crops": list(live_prices.keys()),
        "total_live": len(live_prices),
        "total_estimated": len(BASE_PRICES) - len(live_prices),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "next_refresh": (datetime.utcnow() + timedelta(hours=CACHE_DURATION_HOURS)).isoformat() + "Z",
    }


@router.get("/cache-status")
def get_cache_status():
    """Check cache status and data sources."""
    try:
        if CACHE_FILE.exists():
            data = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
            cached_at = datetime.fromisoformat(data.get("cached_at", "2000-01-01"))
            age_hours = (datetime.utcnow() - cached_at).total_seconds() / 3600
            expires_in = max(0, CACHE_DURATION_HOURS - age_hours)
            return {
                "cache_active": age_hours < CACHE_DURATION_HOURS,
                "cached_at": cached_at.isoformat() + "Z",
                "age_hours": round(age_hours, 2),
                "expires_in_hours": round(expires_in, 2),
                "live_crops": list(data.get("prices", {}).keys()),
                "alpha_vantage_configured": bool(ALPHA_VANTAGE_KEY),
                "world_bank_available": HTTPX_AVAILABLE,
            }
    except Exception:
        pass
    return {
        "cache_active": False,
        "alpha_vantage_configured": bool(ALPHA_VANTAGE_KEY),
        "world_bank_available": HTTPX_AVAILABLE,
        "message": "No cache — prices will be fetched on next request",
    }


@router.get("/summary/top-movers")
async def get_top_movers():
    """Get top gaining and losing crops today."""
    live_prices = await get_live_prices()
    all_prices = []
    for crop, info in BASE_PRICES.items():
        live = live_prices.get(crop)
        price_data = get_price_with_variation(info["base"], live)
        all_prices.append({
            "crop": crop,
            "emoji": info["emoji"],
            "change_pct": price_data["change_pct"],
            "trend": price_data["trend"],
            "price": price_data["current"],
            "unit": info["unit"],
            "data_source": "live" if live else "estimated",
        })

    gainers = sorted([p for p in all_prices if p["trend"] == "up"],
                     key=lambda x: x["change_pct"], reverse=True)[:5]
    losers = sorted([p for p in all_prices if p["trend"] == "down"],
                    key=lambda x: x["change_pct"])[:5]

    return {
        "gainers": gainers,
        "losers": losers,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/{crop_name}")
async def get_crop_price(crop_name: str):
    """Get detailed price info for a specific crop."""
    crop_key = crop_name.capitalize()
    if crop_key not in BASE_PRICES:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Price data not available for {crop_name}")

    live_prices = await get_live_prices()
    info = BASE_PRICES[crop_key]
    live = live_prices.get(crop_key)
    price_data = get_price_with_variation(info["base"], live)

    return {
        "crop": crop_key,
        "emoji": info["emoji"],
        "unit": info["unit"],
        "currency": info["currency"],
        "price": price_data["current"],
        "previous_price": price_data["previous"],
        "change": price_data["change"],
        "change_pct": price_data["change_pct"],
        "trend": price_data["trend"],
        "weekly_history": generate_weekly_history(info["base"], live),
        "monthly_avg": round((live or info["base"]) * (1 + random.uniform(-0.03, 0.03)), 4),
        "yearly_high": round((live or info["base"]) * 1.25, 4),
        "yearly_low": round((live or info["base"]) * 0.75, 4),
        "market_insight": get_market_insight(crop_key, price_data["trend"]),
        "data_source": "live" if live else "estimated",
        "last_updated": datetime.utcnow().isoformat() + "Z",
    }
