from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/calendar", tags=["Crop Calendar"])

# Comprehensive crop planting calendar data
CROP_CALENDAR = {
    "Tomato": {
        "emoji": "🍅",
        "seasons": {
            "Spring": {"plant": "Mar-Apr", "harvest": "Jun-Aug", "notes": "Start indoors 6-8 weeks before last frost"},
            "Summer": {"plant": "May-Jun", "harvest": "Aug-Oct", "notes": "Direct sow after frost risk passes"},
            "Fall": {"plant": "Jul-Aug", "harvest": "Oct-Nov", "notes": "Use heat-tolerant varieties"},
        },
        "days_to_maturity": "60-85 days",
        "soil_temp": "18-24°C",
        "spacing": "45-60 cm apart",
        "depth": "0.5-1 cm",
        "water_needs": "High (1-2 inches/week)",
        "sun": "Full sun (6-8 hrs)",
        "companion_plants": ["Basil", "Carrot", "Marigold"],
        "avoid_planting_with": ["Fennel", "Brassicas"],
        "key_tasks": [
            {"month": 1, "task": "Order seeds, plan garden layout"},
            {"month": 2, "task": "Start seeds indoors under grow lights"},
            {"month": 3, "task": "Transplant seedlings to larger pots"},
            {"month": 4, "task": "Harden off seedlings outdoors"},
            {"month": 5, "task": "Transplant to garden, install cages/stakes"},
            {"month": 6, "task": "Fertilize, monitor for pests and diseases"},
            {"month": 7, "task": "Prune suckers, deep water during heat"},
            {"month": 8, "task": "Harvest ripe tomatoes regularly"},
            {"month": 9, "task": "Continue harvest, watch for late blight"},
            {"month": 10, "task": "Final harvest before frost, save seeds"},
            {"month": 11, "task": "Clean up garden, compost plant debris"},
            {"month": 12, "task": "Plan next season, order seed catalogs"},
        ]
    },
    "Potato": {
        "emoji": "🥔",
        "seasons": {
            "Spring": {"plant": "Mar-Apr", "harvest": "Jun-Aug", "notes": "Plant 2-4 weeks before last frost"},
            "Fall": {"plant": "Jul-Aug", "harvest": "Oct-Nov", "notes": "Use short-season varieties"},
        },
        "days_to_maturity": "70-120 days",
        "soil_temp": "7-13°C",
        "spacing": "30-38 cm apart",
        "depth": "10-15 cm",
        "water_needs": "Medium (1-2 inches/week)",
        "sun": "Full sun (6+ hrs)",
        "companion_plants": ["Beans", "Corn", "Cabbage"],
        "avoid_planting_with": ["Tomato", "Pepper", "Eggplant"],
        "key_tasks": [
            {"month": 2, "task": "Chit (pre-sprout) seed potatoes indoors"},
            {"month": 3, "task": "Prepare beds, add compost"},
            {"month": 4, "task": "Plant seed potatoes 10-15cm deep"},
            {"month": 5, "task": "Hill soil around plants as they grow"},
            {"month": 6, "task": "Monitor for Colorado potato beetle"},
            {"month": 7, "task": "Watch for late blight in humid weather"},
            {"month": 8, "task": "Harvest early varieties when tops die back"},
            {"month": 9, "task": "Harvest main crop, cure in cool dark place"},
            {"month": 10, "task": "Store in cool (4-10°C), dark, humid location"},
        ]
    },
    "Corn": {
        "emoji": "🌽",
        "seasons": {
            "Spring": {"plant": "Apr-May", "harvest": "Jul-Sep", "notes": "Plant when soil reaches 16°C"},
            "Summer": {"plant": "Jun", "harvest": "Sep-Oct", "notes": "Succession plant every 2 weeks"},
        },
        "days_to_maturity": "60-100 days",
        "soil_temp": "16-21°C",
        "spacing": "25-30 cm apart, rows 75-90 cm",
        "depth": "2.5-5 cm",
        "water_needs": "High (1-1.5 inches/week)",
        "sun": "Full sun (8+ hrs)",
        "companion_plants": ["Beans", "Squash", "Pumpkin"],
        "avoid_planting_with": ["Tomato"],
        "key_tasks": [
            {"month": 3, "task": "Test soil, add nitrogen-rich fertilizer"},
            {"month": 4, "task": "Prepare beds, wait for soil to warm"},
            {"month": 5, "task": "Direct sow in blocks (not rows) for pollination"},
            {"month": 6, "task": "Thin to 25-30cm, side-dress with nitrogen"},
            {"month": 7, "task": "Monitor for corn earworm and gray leaf spot"},
            {"month": 8, "task": "Check silk browning — harvest 3 weeks after"},
            {"month": 9, "task": "Harvest when kernels are milky"},
        ]
    },
    "Apple": {
        "emoji": "🍎",
        "seasons": {
            "Spring": {"plant": "Mar-Apr", "harvest": "Aug-Oct", "notes": "Plant bare-root trees in early spring"},
            "Fall": {"plant": "Oct-Nov", "harvest": "Following year", "notes": "Container trees can be planted in fall"},
        },
        "days_to_maturity": "3-5 years (new trees), annual harvest thereafter",
        "soil_temp": "4-10°C for planting",
        "spacing": "4-8 m apart (dwarf: 2-3 m)",
        "depth": "Same depth as nursery pot",
        "water_needs": "Medium (1 inch/week)",
        "sun": "Full sun (6-8 hrs)",
        "companion_plants": ["Chives", "Nasturtium", "Clover"],
        "avoid_planting_with": ["Grass (competes for nutrients)"],
        "key_tasks": [
            {"month": 1, "task": "Order bare-root trees, plan orchard layout"},
            {"month": 2, "task": "Apply dormant oil spray before bud break"},
            {"month": 3, "task": "Plant bare-root trees, prune for shape"},
            {"month": 4, "task": "Monitor for apple scab as leaves emerge"},
            {"month": 5, "task": "Thin fruits to 15-20cm apart for larger apples"},
            {"month": 6, "task": "Apply summer pruning, monitor for pests"},
            {"month": 7, "task": "Continue pest monitoring, water during drought"},
            {"month": 8, "task": "Harvest early varieties (check color & taste)"},
            {"month": 9, "task": "Main harvest season — store in cool location"},
            {"month": 10, "task": "Late varieties harvest, clean up fallen fruit"},
            {"month": 11, "task": "Apply fall fertilizer, mulch around base"},
            {"month": 12, "task": "Winter pruning to remove dead/crossing branches"},
        ]
    },
    "Wheat": {
        "emoji": "🌾",
        "seasons": {
            "Winter": {"plant": "Sep-Nov", "harvest": "Jun-Jul", "notes": "Winter wheat — most common variety"},
            "Spring": {"plant": "Mar-Apr", "harvest": "Aug-Sep", "notes": "Spring wheat for shorter seasons"},
        },
        "days_to_maturity": "240-300 days (winter), 90-110 days (spring)",
        "soil_temp": "4-12°C",
        "spacing": "Broadcast or drill at 90-120 kg/ha",
        "depth": "2.5-4 cm",
        "water_needs": "Low-Medium (450-650mm/season)",
        "sun": "Full sun",
        "companion_plants": ["Clover (cover crop)"],
        "avoid_planting_with": ["Other cereals (disease risk)"],
        "key_tasks": [
            {"month": 9, "task": "Prepare seedbed, apply base fertilizer"},
            {"month": 10, "task": "Sow winter wheat, apply pre-emergence herbicide"},
            {"month": 11, "task": "Monitor establishment, apply slug control if needed"},
            {"month": 2, "task": "Apply nitrogen top-dressing at tillering"},
            {"month": 4, "task": "Apply fungicide for septoria and rust"},
            {"month": 5, "task": "Monitor for aphids, apply second fungicide"},
            {"month": 6, "task": "Harvest when grain moisture is 14-15%"},
            {"month": 7, "task": "Store grain properly, test for quality"},
        ]
    },
    "Rice": {
        "emoji": "🍚",
        "seasons": {
            "Wet Season": {"plant": "May-Jun", "harvest": "Oct-Nov", "notes": "Main season — flooded paddies"},
            "Dry Season": {"plant": "Nov-Dec", "harvest": "Mar-Apr", "notes": "Irrigated rice"},
        },
        "days_to_maturity": "105-150 days",
        "soil_temp": "20-35°C",
        "spacing": "20x20 cm (transplanted)",
        "depth": "2-3 cm (direct seeded)",
        "water_needs": "Very High (flooded paddies)",
        "sun": "Full sun",
        "companion_plants": ["Azolla (nitrogen fixer)"],
        "avoid_planting_with": ["Weeds (critical to control)"],
        "key_tasks": [
            {"month": 4, "task": "Prepare nursery beds, soak seeds 24 hours"},
            {"month": 5, "task": "Sow in nursery, prepare main field"},
            {"month": 6, "task": "Transplant 21-day-old seedlings"},
            {"month": 7, "task": "Apply nitrogen fertilizer at tillering"},
            {"month": 8, "task": "Maintain water level, monitor for blast disease"},
            {"month": 9, "task": "Drain field 2 weeks before harvest"},
            {"month": 10, "task": "Harvest when 80% of grains are golden"},
            {"month": 11, "task": "Dry grain to 14% moisture, store properly"},
        ]
    },
    "Soybean": {
        "emoji": "🫘",
        "seasons": {
            "Spring": {"plant": "May-Jun", "harvest": "Sep-Oct", "notes": "Plant after last frost when soil is warm"},
        },
        "days_to_maturity": "75-120 days",
        "soil_temp": "13-18°C",
        "spacing": "5-8 cm apart, rows 45-75 cm",
        "depth": "2.5-4 cm",
        "water_needs": "Medium (1 inch/week)",
        "sun": "Full sun",
        "companion_plants": ["Corn", "Squash"],
        "avoid_planting_with": ["Onion", "Garlic"],
        "key_tasks": [
            {"month": 4, "task": "Test soil pH (target 6.0-6.8), inoculate seeds"},
            {"month": 5, "task": "Plant after soil reaches 13°C"},
            {"month": 6, "task": "Cultivate for weed control"},
            {"month": 7, "task": "Monitor for soybean aphids and spider mites"},
            {"month": 8, "task": "Watch for sudden death syndrome"},
            {"month": 9, "task": "Harvest when pods rattle and leaves drop"},
        ]
    },
    "Grape": {
        "emoji": "🍇",
        "seasons": {
            "Spring": {"plant": "Mar-Apr", "harvest": "Aug-Oct", "notes": "Plant dormant vines in early spring"},
        },
        "days_to_maturity": "2-3 years (new vines), annual harvest thereafter",
        "soil_temp": "10-15°C for planting",
        "spacing": "1.8-2.4 m apart, rows 2.4-3 m",
        "depth": "Same as nursery pot",
        "water_needs": "Low-Medium (drought tolerant once established)",
        "sun": "Full sun (8+ hrs)",
        "companion_plants": ["Roses", "Clover", "Geranium"],
        "avoid_planting_with": ["Cabbage", "Radish"],
        "key_tasks": [
            {"month": 2, "task": "Heavy dormant pruning — remove 80-90% of growth"},
            {"month": 3, "task": "Apply dormant spray for disease prevention"},
            {"month": 4, "task": "Bud break — begin fungicide program"},
            {"month": 5, "task": "Shoot positioning, apply fungicides for mildew"},
            {"month": 6, "task": "Cluster thinning for quality improvement"},
            {"month": 7, "task": "Leaf removal around clusters for air circulation"},
            {"month": 8, "task": "Veraison (color change) — reduce irrigation"},
            {"month": 9, "task": "Harvest when Brix reaches target level"},
            {"month": 10, "task": "Post-harvest fertilization"},
            {"month": 11, "task": "Prepare for dormancy, apply compost"},
        ]
    },
}

MONTHLY_TASKS = {
    1:  {"name": "January",  "icon": "❄️",  "general": "Plan garden layout, order seeds, maintain equipment"},
    2:  {"name": "February", "icon": "🌱",  "general": "Start seeds indoors, apply dormant sprays to fruit trees"},
    3:  {"name": "March",    "icon": "🌿",  "general": "Prepare beds, plant cool-season crops, prune fruit trees"},
    4:  {"name": "April",    "icon": "🌸",  "general": "Transplant seedlings, direct sow warm-season crops"},
    5:  {"name": "May",      "icon": "☀️",  "general": "Plant after last frost, fertilize, monitor for pests"},
    6:  {"name": "June",     "icon": "🌞",  "general": "Irrigate regularly, harvest early crops, apply mulch"},
    7:  {"name": "July",     "icon": "🔥",  "general": "Deep watering, pest control, harvest summer crops"},
    8:  {"name": "August",   "icon": "🌾",  "general": "Main harvest season, save seeds, plant fall crops"},
    9:  {"name": "September","icon": "🍂",  "general": "Fall planting, harvest root crops, apply compost"},
    10: {"name": "October",  "icon": "🍁",  "general": "Final harvests, plant garlic, prepare beds for winter"},
    11: {"name": "November", "icon": "🌧️",  "general": "Clean up garden, plant cover crops, mulch perennials"},
    12: {"name": "December", "icon": "🌨️",  "general": "Rest, plan next season, maintain tools and equipment"},
}


@router.get("")
def get_all_crops():
    """Get list of all crops with basic calendar info."""
    return [
        {
            "crop": crop,
            "emoji": data["emoji"],
            "days_to_maturity": data["days_to_maturity"],
            "seasons": list(data["seasons"].keys()),
            "water_needs": data["water_needs"],
            "sun": data["sun"],
        }
        for crop, data in CROP_CALENDAR.items()
    ]


@router.get("/monthly/{month}")
def get_monthly_tasks(month: int):
    """Get all farming tasks for a specific month (1-12)."""
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    month_info = MONTHLY_TASKS[month]
    tasks = []

    for crop, data in CROP_CALENDAR.items():
        for task_item in data.get("key_tasks", []):
            if task_item["month"] == month:
                tasks.append({
                    "crop": crop,
                    "emoji": data["emoji"],
                    "task": task_item["task"],
                })

    return {
        "month": month,
        "name": month_info["name"],
        "icon": month_info["icon"],
        "general_advice": month_info["general"],
        "crop_tasks": tasks,
    }


@router.get("/crop/{crop_name}")
def get_crop_calendar(crop_name: str):
    """Get full calendar details for a specific crop."""
    crop_key = crop_name.capitalize()
    if crop_key not in CROP_CALENDAR:
        raise HTTPException(status_code=404, detail=f"Calendar not available for {crop_name}")

    return {"crop": crop_key, **CROP_CALENDAR[crop_key]}


@router.get("/companion-planting")
def get_companion_planting():
    """Get companion planting guide for all crops."""
    return [
        {
            "crop": crop,
            "emoji": data["emoji"],
            "good_companions": data["companion_plants"],
            "bad_companions": data["avoid_planting_with"],
        }
        for crop, data in CROP_CALENDAR.items()
    ]
