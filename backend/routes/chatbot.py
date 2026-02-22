"""
LiAn — LeafScan Intelligent Agricultural Assistant
Primary LLM: Google Gemini 1.5 Flash (free, powerful, answers ANY question)
Fallback: Smart KB scoring engine (40+ agriculture topics)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_active_user
import models, schemas
from datetime import datetime
import re, os, logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("leafscan.lian")

# ── Google Gemini Setup ───────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
_gemini_model = None

LIAN_SYSTEM = (
    "You are LiAn, an expert AI agricultural assistant for the LeafScan app. "
    "You have deep expertise in: plant diseases and treatments, crop cultivation for 20+ crops, "
    "irrigation and water management, fertilization (NPK, organic, micronutrients), "
    "pest and insect control, soil health and pH management, weather impacts on crops, "
    "harvest timing, post-harvest handling, organic farming, and modern agronomy. "
    "Personality: warm, helpful, specific, and actionable. "
    "Use emojis naturally. Format with markdown: **bold** for key terms, bullet points for lists, numbered steps for procedures. "
    "Always give concrete, specific advice with product names and quantities when relevant. "
    "For disease questions: state the pathogen name, symptoms, step-by-step treatment with specific product names, then prevention. "
    "Keep responses focused and under 500 words. "
    "You can answer ANY agriculture-related question intelligently. "
    "Never say you cannot answer a farming question — always provide your best expert advice."
)

def _get_gemini():
    global _gemini_model
    if _gemini_model is not None:
        return _gemini_model
    if not GEMINI_API_KEY:
        return None
    try:
        from google import genai
        _gemini_model = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("✅ Gemini (google-genai SDK) initialized successfully")
        return _gemini_model
    except Exception as e:
        logger.warning(f"Gemini init failed: {e}")
        return None

async def _gemini_response(message: str, history: list = None) -> str:
    """Get response from Google Gemini 2.0 Flash using new google-genai SDK."""
    client = _get_gemini()
    if not client:
        return None
    try:
        from google import genai
        from google.genai import types

        # Build conversation contents with history
        contents = []
        if history:
            for h in history[-10:]:
                role = "user" if h["role"] == "user" else "model"
                contents.append(types.Content(role=role, parts=[types.Part(text=h["content"])]))
        contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=LIAN_SYSTEM,
                temperature=0.7,
                max_output_tokens=600,
            ),
        )
        return response.text.strip()
    except Exception as e:
        logger.warning(f"Gemini API error: {e}")
        return None

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

# ── Knowledge Base (Fallback) ─────────────────────────────────────────────────
KB = []
def _a(k, r): KB.append({"k": k, "r": r})

# GREETINGS
_a(["hello","hi","hey","good morning","good afternoon","greetings","start","begin"],
   "Hi! I am LiAn, share me your problems 🌿\n\nI'm powered by **Google Gemini AI** and can answer ANY farming question intelligently!\n\n**I can help with:**\n- 🔬 Plant disease diagnosis & treatment\n- 🌱 Crop cultivation guides (20+ crops)\n- 💧 Irrigation & water management\n- 🌿 Fertilization strategies\n- 🐛 Pest & insect control\n- 🌤️ Weather impact on crops\n- 🌾 Harvest timing & post-harvest care\n- 🧪 Soil health & pH management\n\nAsk me anything about farming!")

# TOMATO DISEASES
_a(["tomato early blight","early blight tomato","alternaria tomato","brown spots lower leaves tomato","concentric rings tomato","bullseye spots tomato"],
   "🍅 **Tomato Early Blight** (Alternaria solani)\n\n**Symptoms:** Brown spots with concentric rings (bullseye pattern), yellow halo, starts on LOWER/OLDER leaves\n\n**Treatment:**\n1. Remove all infected lower leaves immediately\n2. Apply **Chlorothalonil** every 7-10 days\n3. **Azoxystrobin** — systemic strobilurin\n4. **Mancozeb** — broad-spectrum protective\n\n**Organic:** Copper fungicide or Neem oil (2%)\n\n**Prevention:** Stake plants, water at base only, mulch, rotate crops every 3 years")

_a(["tomato late blight","late blight tomato","phytophthora tomato","water soaked lesions tomato","white mold tomato"],
   "🚨 **Tomato Late Blight — EMERGENCY!** (Phytophthora infestans)\n\n**Can destroy a field in 3-5 days!**\n\n**Symptoms:** Dark water-soaked lesions, white fuzzy mold on leaf undersides\n\n**IMMEDIATE Actions:**\n1. Remove and destroy all infected plants — burn or bury deep\n2. Apply **Metalaxyl (Ridomil Gold)** — most effective systemic\n3. Apply **Chlorothalonil** as protective cover spray\n4. Warn neighboring farmers — spores travel miles by wind\n\n**Prevention:** Certified disease-free transplants, resistant varieties, avoid overhead irrigation")

_a(["tomato leaf mold","leaf mold tomato","cladosporium tomato","yellow spots tomato upper","velvety mold tomato"],
   "🍅 **Tomato Leaf Mold** (Passalora fulva)\n\n**Symptoms:** Pale yellow spots on UPPER leaf surface, olive-green VELVETY MOLD on undersides\n\n**Treatment:**\n1. Improve ventilation — reduce humidity below 85%\n2. Apply Chlorothalonil or Mancozeb\n3. Azoxystrobin or Difenoconazole — systemic options\n\n**Prevention:** Space plants 18-24 inches, avoid overhead watering, ventilate greenhouses")

_a(["tomato septoria","septoria leaf spot","small spots tomato","gray center spots tomato"],
   "🍅 **Tomato Septoria Leaf Spot** (Septoria lycopersici)\n\n**Symptoms:** Numerous small circular spots with dark borders and light gray centers, tiny black dots in center\n\n**Treatment:**\n1. Remove infected lower leaves immediately\n2. Apply Chlorothalonil every 7-10 days\n3. Mancozeb or Copper fungicide\n\n**Prevention:** Mulch around plants, water at base only, stake plants, rotate crops")

_a(["tomato mosaic virus","mosaic virus tomato","mottled leaves tomato","distorted leaves tomato"],
   "🍅 **Tomato Mosaic Virus (ToMV/TMV)**\n\n**No cure exists for viral diseases!**\n\n**Symptoms:** Mottled light/dark green mosaic pattern, distorted/curled leaves, stunted growth\n\n**Management:**\n1. Remove and destroy infected plants immediately\n2. Disinfect tools with 10% bleach between plants\n3. Control aphid vectors with imidacloprid\n4. Wash hands before handling plants\n\n**Prevention:** Virus-resistant varieties, certified virus-free seeds, control aphids aggressively")

_a(["tomato yellow leaf curl","tylcv","curl virus tomato","upward curling tomato","whitefly tomato virus"],
   "🍅 **Tomato Yellow Leaf Curl Virus (TYLCV)**\n\nTransmitted exclusively by whiteflies (Bemisia tabaci)\n\n**Symptoms:** Upward curling + yellowing of leaves, stunted bushy growth, severely reduced fruit set\n\n**No cure — focus on vector control:**\n1. Yellow sticky traps for whiteflies\n2. Imidacloprid (systemic insecticide)\n3. Reflective silver mulch\n4. Remove infected plants immediately\n5. Use resistant varieties (look for 'TY' in variety name)")

# TOMATO GROWTH ISSUES
_a(["tomato not getting bigger","tomato fruit small","small tomatoes","tomato not growing bigger","tomato fruit size","tomatoes staying small","fruit not enlarging"],
   "🍅 **Tomato Fruit Not Getting Bigger — Causes & Solutions**\n\n**1. 🌡️ Temperature Stress (most common)**\n- Tomatoes stop growing when temps exceed 35°C or drop below 13°C\n- Solution: Shade cloth (30%) during heat, increase watering\n\n**2. 💧 Inconsistent Watering**\n- Irregular watering stunts fruit development\n- Solution: Water deeply every 2-3 days, mulch heavily\n\n**3. 🌱 Nutrient Deficiency**\n- Low potassium = small, poor-quality fruit\n- Solution: Apply potassium sulfate (0-0-50) + calcium spray\n\n**4. 🌸 Poor Pollination**\n- Tomatoes need vibration to release pollen\n- Solution: Gently shake plants daily\n\n**5. 🍃 Too Many Fruits**\n- Solution: Remove some small fruits to let remaining ones grow larger\n\n**6. 🌿 Excess Nitrogen**\n- Too much nitrogen = lush leaves but small fruit\n- Solution: Stop nitrogen, switch to phosphorus + potassium")

# POTATO DISEASES
_a(["potato late blight","late blight potato","phytophthora potato","potato blight"],
   "🥔 **Potato Late Blight** (Phytophthora infestans)\n\n**Same pathogen as the Irish Potato Famine!**\n\n**Symptoms:** Dark water-soaked lesions on leaves, white mold on undersides, brown rot in tubers\n\n**Treatment:**\n1. Apply **Metalaxyl + Mancozeb** immediately\n2. Chlorothalonil as protective spray\n3. Destroy infected plant material\n\n**Prevention:** Certified seed potatoes, resistant varieties, hill up soil around plants, avoid overhead irrigation")

_a(["potato early blight","early blight potato","alternaria potato","brown spots potato"],
   "🥔 **Potato Early Blight** (Alternaria solani)\n\n**Symptoms:** Dark brown spots with concentric rings on older leaves, yellow halo\n\n**Treatment:**\n1. Apply Chlorothalonil or Mancozeb every 7-10 days\n2. Azoxystrobin — systemic option\n3. Remove infected leaves\n\n**Prevention:** Crop rotation, balanced fertilization, avoid water stress")

# RICE DISEASES
_a(["rice blast","blast rice","magnaporthe rice","diamond lesions rice","neck blast rice"],
   "🌾 **Rice Blast** (Magnaporthe oryzae)\n\n**Most economically important rice disease worldwide!**\n\n**Symptoms:** Diamond-shaped lesions with gray centers and brown borders; neck blast causes complete panicle death\n\n**Treatment:**\n1. **Tricyclazole** — most effective systemic fungicide\n2. **Isoprothiolane** — systemic with good efficacy\n3. **Propiconazole** — broad spectrum triazole\n4. Apply at booting stage to prevent neck blast!\n\n**Prevention:** Blast-resistant varieties (IR64, Swarna), avoid excess nitrogen, apply silicon fertilizer")

_a(["rice brown spot","brown spot rice","cochliobolus rice","oval lesions rice"],
   "🌾 **Rice Brown Spot** (Cochliobolus miyabeanus)\n\n**Symptoms:** Oval brown lesions with yellow halos on leaves; strongly linked to nutrient deficiency\n\n**Treatment:**\n1. Mancozeb — protective fungicide\n2. Iprodione — systemic\n3. Improve soil fertility with balanced NPK\n\n**Prevention:** Certified disease-free seeds, balanced soil nutrition, silicon fertilizer")

_a(["rice bacterial leaf blight","bacterial blight rice","xanthomonas rice","yellow margins rice","white leaves rice"],
   "🌾 **Rice Bacterial Leaf Blight** (Xanthomonas oryzae)\n\n**Symptoms:** Water-soaked lesions that turn yellow then white along leaf margins\n\n**Treatment:**\n1. No highly effective chemical cure\n2. Copper bactericides may reduce spread\n3. Drain fields during early infection\n\n**Prevention:** Resistant varieties, avoid excess nitrogen, improve field drainage, certified disease-free seeds")

_a(["rice sheath blight","sheath blight rice","rhizoctonia rice","oval lesions sheath"],
   "🌾 **Rice Sheath Blight** (Rhizoctonia solani)\n\n**Symptoms:** Oval lesions on leaf sheaths with gray-white centers and brown borders\n\n**Treatment:**\n1. **Validamycin** — most effective\n2. Hexaconazole — systemic triazole\n3. Propiconazole — broad spectrum\n\n**Prevention:** Reduce plant density, avoid excess nitrogen, drain fields periodically")

# WHEAT DISEASES
_a(["wheat yellow rust","stripe rust wheat","yellow rust wheat","puccinia striiformis","yellow stripes wheat"],
   "🌾 **Wheat Yellow Rust / Stripe Rust** (Puccinia striiformis)\n\n**Can cause 70%+ yield loss in susceptible varieties!**\n\n**Symptoms:** Yellow-orange pustules in stripes along leaf veins\n\n**Treatment:**\n1. **Tebuconazole** — most effective triazole\n2. **Propiconazole** — systemic\n3. Azoxystrobin + propiconazole combination\n\n**Prevention:** Plant resistant varieties, monitor from tillering, apply preventive fungicides in high-risk areas")

_a(["wheat brown rust","leaf rust wheat","puccinia triticina","orange pustules wheat"],
   "🌾 **Wheat Brown Rust / Leaf Rust** (Puccinia triticina)\n\n**Symptoms:** Small round orange-brown pustules on upper leaf surfaces\n\n**Treatment:**\n1. Triazole fungicides (tebuconazole, propiconazole)\n2. Strobilurin fungicides (azoxystrobin)\n\n**Prevention:** Plant resistant varieties, early planting, monitor from tillering stage")

# CORN DISEASES
_a(["corn northern leaf blight","northern leaf blight corn","turcicum corn","cigar shaped lesions corn","gray lesions corn"],
   "🌽 **Corn Northern Leaf Blight** (Exserohilum turcicum)\n\n**Symptoms:** Long cigar-shaped gray-green lesions (1-6 inches) on leaves\n\n**Treatment:**\n1. Azoxystrobin — strobilurin fungicide\n2. Propiconazole — triazole\n3. Apply at tasseling stage for best results\n\n**Prevention:** Resistant hybrids, crop rotation, bury crop residues")

_a(["corn gray leaf spot","gray leaf spot corn","cercospora corn","rectangular lesions corn"],
   "🌽 **Corn Gray Leaf Spot** (Cercospora zeae-maydis)\n\n**Symptoms:** Rectangular gray-tan lesions with parallel edges, limited by leaf veins\n\n**Treatment:**\n1. Azoxystrobin + propiconazole\n2. Pyraclostrobin — strobilurin\n\n**Prevention:** Resistant hybrids, crop rotation, reduce crop residue")

# WATERING
_a(["watered morning should water evening","water morning water evening","already watered water again","how often water","when to water","water twice day","morning watering evening"],
   "💧 **Watering Frequency — Smart Irrigation Advice**\n\n**If you watered in the morning, should you water again in the evening?**\n\n**Generally: NO — once per day is usually enough**, but depends on:\n- Temperature above 35°C → light evening water may help\n- Sandy soil dries faster than clay\n- Fruiting plants need more water than seedlings\n\n**The Finger Test (most reliable):**\n- Push finger 2 inches into soil\n- Moist = don't water yet ✓\n- Dry = water now\n- Wet/soggy = you're overwatering!\n\n**Best practice:**\n- Water deeply (15-20 cm) every 2-3 days\n- Water in the morning so foliage dries during the day\n- Use drip irrigation or water at the base\n- Mulch to retain moisture (reduces watering by 50%)")

_a(["best time water","when water plants","morning evening water","water at night","water schedule"],
   "💧 **Best Time to Water Your Crops**\n\n**Morning watering is BEST (6-10 AM)**\n- Plants absorb water before heat of day\n- Foliage dries quickly — reduces fungal disease risk\n\n**Evening watering (acceptable but not ideal)**\n- Foliage stays wet overnight — increases fungal disease risk\n- If you must water in evening, water at the BASE only\n\n**Midday watering (avoid)**\n- Up to 50% water loss from evaporation\n\n**Bottom line:** Morning is best, evening is okay if you water at the base, midday is wasteful")

_a(["overwatering","too much water","waterlogged","soggy soil","root rot","wilting wet soil"],
   "💧 **Overwatering — Signs & Recovery**\n\n**Signs your plant is overwatered:**\n- Yellow leaves (especially lower/older leaves)\n- Wilting despite wet soil\n- Mushy, brown roots\n- Mold on soil surface\n\n**Overwatering is MORE dangerous than underwatering!**\n\n**Recovery steps:**\n1. Stop watering immediately\n2. Check drainage holes are not blocked\n3. For field crops: improve drainage with furrows\n4. Apply Metalaxyl if root rot is suspected\n5. Resume watering only when top 5 cm of soil are dry")

_a(["drip irrigation","drip system","drip vs sprinkler","how set up drip","irrigation system"],
   "💧 **Drip Irrigation — Complete Guide**\n\n**Why drip irrigation is best:**\n- 30-50% water savings vs. flood irrigation\n- Water goes directly to roots\n- Keeps foliage dry — reduces fungal diseases\n- Can be combined with fertigation (fertilizer through drip)\n\n**Basic setup:**\n1. Water source → pressure regulator (1-1.5 bar)\n2. Filter (mesh filter to prevent clogging)\n3. Main supply line (16mm poly tubing)\n4. Drip emitters or drip tape along plant rows\n5. End caps to close the lines\n\n**Cost:** Basic system for 1 acre: $200-500 — pays back in water savings within 1-2 seasons")

# FERTILIZER
_a(["fertilizer","fertilize","npk","urea","dap","fertilization","plant food","what fertilizer","how fertilize"],
   "🌱 **Complete Fertilization Guide**\n\n**The Big Three (NPK):**\n\n**Nitrogen (N) — Growth Nutrient**\n- Promotes leafy, green growth\n- Deficiency: yellowing of older leaves\n- Sources: Urea (46-0-0), Ammonium nitrate, Compost\n\n**Phosphorus (P) — Root & Flower Power**\n- Essential for root development, flowering, fruiting\n- Deficiency: purple/reddish leaves, poor root growth\n- Sources: DAP (18-46-0), Superphosphate, Bone meal\n\n**Potassium (K) — Disease Resistance**\n- Overall plant health, disease resistance, fruit quality\n- Deficiency: brown leaf edges, weak stems\n- Sources: Muriate of potash (0-0-60), Wood ash\n\n**Golden Rule: Always soil test before fertilizing!**")

_a(["nitrogen deficiency","yellow leaves nitrogen","pale leaves","yellowing leaves","leaves turning yellow","leaves going yellow","yellow leaves"],
   "🌱 **Yellow Leaves — Nitrogen Deficiency**\n\n**Symptoms:**\n- Yellowing starts on OLDER/LOWER leaves first (key identifier)\n- Pale green to yellow color throughout plant\n- Stunted, slow growth\n\n**Quick fix:**\n1. Apply urea (46-0-0) — fastest nitrogen source\n2. Fish emulsion — organic quick fix\n3. Foliar spray of urea (1-2%) for fastest response\n\n**BUT** — yellow leaves can also mean:\n- Overwatering (check soil moisture first!)\n- Iron deficiency (yellow between green veins)\n- Viral infection (mosaic pattern)\n\n**Diagnosis tip:** If lower leaves yellow first → nitrogen. If upper leaves yellow → iron/manganese. If all leaves → overwatering or severe nitrogen.")

_a(["potassium deficiency","brown leaf edges","leaf scorch","weak stems","poor fruit quality","brown edges leaves"],
   "🌱 **Potassium Deficiency**\n\n**Symptoms:** Brown scorched edges on leaves (starts on older leaves), weak stems, poor fruit quality\n\n**Treatment:**\n1. Muriate of Potash (KCl, 0-0-60) — most economical\n2. Sulfate of Potash (0-0-50) — better for chloride-sensitive crops\n3. Wood ash — organic source\n\nHigh potassium needs: Potato, Tomato, Banana, Sugarcane, Citrus")

_a(["phosphorus deficiency","purple leaves","red leaves","poor roots","slow growth phosphorus","reddish leaves"],
   "🌱 **Phosphorus Deficiency**\n\n**Symptoms:** Purple or reddish coloration on leaves (especially undersides), poor root development, delayed maturity\n\n**Treatment:**\n1. DAP (18-46-0) — most common phosphorus fertilizer\n2. Superphosphate (0-20-0)\n3. Bone meal — organic option\n\n**Important:** Phosphorus availability depends on soil pH! Best at pH 6.0-7.0. Fix soil pH first if outside optimal range.")

_a(["soil ph","acidic soil","alkaline soil","lime soil","soil test","ph adjustment","soil acidity"],
   "🌍 **Soil pH Management**\n\n**Ideal pH by crop:**\n- Tomato, Pepper, Corn: 6.0-6.8\n- Potato: 5.0-6.5\n- Rice: 5.5-7.0\n- Wheat, Barley: 6.0-7.0\n- Blueberry: 4.5-5.5\n- Sugarcane: 6.0-7.5\n\n**Raising pH (too acidic):** Add agricultural lime (1-2 tons/acre)\n**Lowering pH (too alkaline):** Add elemental sulfur (200-500 kg/ha)\n\nWhy pH matters: Controls nutrient availability, affects beneficial soil microorganisms")

# PESTS
_a(["aphids","aphid infestation","green insects leaves","sticky leaves","curling leaves insects","plant lice"],
   "🐛 **Aphid Control**\n\n**Identification:** Tiny soft-bodied insects (green, black, or white), clustered on new growth and leaf undersides, sticky honeydew residue\n\n**Treatment:**\n1. Strong water spray to knock off aphids (repeat daily)\n2. Insecticidal soap (2% solution)\n3. Neem oil spray (2%)\n4. **Imidacloprid** — systemic insecticide for severe infestations\n5. Introduce ladybugs — natural predators\n\n**Prevention:** Avoid excess nitrogen (attracts aphids), use reflective mulch, encourage beneficial insects")

_a(["whitefly","white flies","whiteflies","tiny white insects","white powder insects"],
   "🐛 **Whitefly Control**\n\n**Identification:** Tiny white moth-like insects that fly up when plant is disturbed, found on leaf undersides\n\n**Treatment:**\n1. Yellow sticky traps (most effective monitoring tool)\n2. Insecticidal soap or neem oil\n3. **Imidacloprid** — systemic, very effective\n4. **Spiromesifen** — excellent for whitefly\n5. Reflective silver mulch repels whiteflies\n\n**Important:** Whiteflies transmit TYLCV virus in tomatoes — control them aggressively!")

_a(["spider mites","mites","webbing leaves","stippling leaves","bronze leaves","tiny red insects"],
   "🐛 **Spider Mite Control**\n\n**Identification:** Fine webbing on leaf undersides, stippled bronze/yellow leaves, worst in hot dry conditions\n\n**Treatment:**\n1. Strong water spray to knock off mites (repeat daily)\n2. Insecticidal soap (2% solution)\n3. Neem oil spray\n4. **Abamectin** — most effective miticide\n5. Predatory mites (Phytoseiulus persimilis) — biological control\n\n**Prevention:** Maintain adequate humidity, avoid dusty conditions, avoid broad-spectrum insecticides that kill natural predators")

_a(["stem borer","borer","caterpillar","worm inside stem","dead heart","white ear rice","corn borer"],
   "🐛 **Stem Borer Control**\n\n**Identification:** Dead heart (central shoot dies), frass (insect droppings) at entry holes, caterpillar inside stem\n\n**Treatment:**\n1. **Chlorpyrifos** — contact insecticide\n2. **Carbofuran** granules — systemic (apply in soil)\n3. **Fipronil** — highly effective\n4. Bacillus thuringiensis (Bt) — organic option\n5. Remove and destroy infested plants\n\n**Prevention:** Early planting, resistant varieties, pheromone traps for monitoring, crop rotation")

_a(["fungicide","fungicide spray","which fungicide","best fungicide","fungicide recommendation"],
   "🧪 **Fungicide Guide**\n\n**Protective (preventive) fungicides:**\n- Mancozeb — broad spectrum, economical\n- Chlorothalonil — excellent for many diseases\n- Copper hydroxide — organic-approved\n\n**Systemic (curative) fungicides:**\n- Tebuconazole — excellent for rusts, blights\n- Propiconazole — broad spectrum triazole\n- Azoxystrobin — strobilurin, excellent systemic\n- Metalaxyl — specific for Phytophthora/Pythium\n\n**Golden rules:**\n1. Rotate fungicide classes to prevent resistance\n2. Apply preventively before disease appears\n3. Follow label rates exactly\n4. Apply in early morning or evening")

# HARVEST
_a(["when harvest tomato","harvest tomato","tomato ripe","tomato maturity","pick tomato"],
   "🍅 **When to Harvest Tomatoes**\n\n**Signs of maturity:**\n- Full color development (red, yellow, or variety color)\n- Slight softness when gently squeezed\n- Fruit separates easily from vine\n- 60-85 days from transplanting (variety dependent)\n\n**Harvesting tips:**\n- Harvest in the morning when temperatures are cool\n- Use clean, sharp scissors or pruning shears\n- Leave a short stem attached\n- Handle gently to avoid bruising\n\n**Storage:** Room temperature (never refrigerate fresh tomatoes — destroys flavor!)")

_a(["when harvest rice","rice harvest","rice maturity","paddy harvest","rice ready harvest"],
   "🌾 **When to Harvest Rice**\n\n**Signs of maturity:**\n- 80-85% of grains are golden yellow\n- Grains are hard when pressed\n- 105-150 days from transplanting (variety dependent)\n- Moisture content: 20-25% at harvest\n\n**Harvesting:**\n- Drain field 10-15 days before harvest\n- Harvest in the morning to reduce shattering losses\n- Thresh within 24 hours of cutting\n- Dry to 14% moisture for safe storage")

# WEATHER
_a(["drought","water stress","dry weather","no rain","drought stress","water shortage"],
   "🌤️ **Drought Management for Crops**\n\n**Immediate actions:**\n1. Prioritize irrigation for most critical growth stages\n2. Apply mulch (5-10 cm) to reduce evaporation by 50%\n3. Reduce plant density if drought is severe\n4. Apply potassium fertilizer — improves drought tolerance\n\n**Drought-tolerant practices:**\n- Drip irrigation (most efficient)\n- Rainwater harvesting\n- Drought-resistant varieties\n- Shade nets to reduce evapotranspiration\n\n**Critical water stages:** Flowering and grain filling are most sensitive to drought")

_a(["flood","flooding","waterlogged field","too much rain","flooded crops","excess rain"],
   "🌧️ **Flood/Waterlogging Management**\n\n**Immediate actions:**\n1. Drain excess water as quickly as possible\n2. Create drainage channels/furrows\n3. Do NOT apply fertilizer to waterlogged soil\n4. Apply fungicide after water recedes (root rot risk)\n\n**After flooding:**\n1. Check for root rot — apply Metalaxyl\n2. Apply foliar fertilizer (plants can't absorb from waterlogged soil)\n3. Replant if plants are severely damaged\n4. Monitor for disease outbreaks (fungal diseases increase after flooding)")

# ORGANIC FARMING
_a(["organic farming","organic pesticide","organic fertilizer","natural farming","no chemicals","organic methods"],
   "🌿 **Organic Farming Guide**\n\n**Organic fertilizers:**\n- Compost — balanced nutrition, improves soil structure\n- Vermicompost — high quality, fast-acting\n- Neem cake — fertilizer + pest repellent\n- Fish emulsion — quick nitrogen source\n- Bone meal — phosphorus source\n\n**Organic pest control:**\n- Neem oil (2%) — broad spectrum\n- Insecticidal soap — soft-bodied insects\n- Bacillus thuringiensis (Bt) — caterpillars\n- Diatomaceous earth — crawling insects\n- Beneficial insects (ladybugs, lacewings)\n\n**Organic disease control:**\n- Copper fungicide — approved for organic use\n- Sulfur fungicide — powdery mildew\n- Baking soda spray (1%) — mild fungicide")

# GENERAL HELP
_a(["help","what can you do","what do you know","capabilities","features","what questions"],
   "Hi! I am LiAn 🌿 Here's what I can help you with:\n\n**🔬 Disease Diagnosis & Treatment**\n- Tomato, Potato, Rice, Wheat, Corn, Banana, Mango, Coffee diseases\n- Specific fungicide/pesticide recommendations\n\n**🌱 Crop Cultivation**\n- Growing guides for 20+ crops\n- Planting, spacing, fertilization schedules\n\n**💧 Irrigation & Water Management**\n- When and how much to water\n- Drip irrigation setup\n- Drought and flood management\n\n**🌿 Fertilization**\n- NPK recommendations by crop\n- Deficiency diagnosis and correction\n- Organic alternatives\n\n**🐛 Pest Control**\n- Aphids, whiteflies, mites, borers\n- Organic and chemical options\n\n**🌤️ Weather & Climate**\n- Drought management\n- Flood recovery\n- Temperature stress\n\nJust ask me anything — I'll give you expert advice!")

# ── SCORING ENGINE ────────────────────────────────────────────────────────────

# Words too generic to score on their own (crop names, common words)
GENERIC_WORDS = {
    'tomato','potato','rice','wheat','corn','maize','sugarcane','banana','mango',
    'coffee','apple','grape','pepper','soybean','plant','crop','leaf','leaves',
    'grow','growing','farm','farmer','help','problem','issue','what','have',
    'does','will','that','this','with','from','they','them','their','there',
    'when','where','should','need','want','your','mine','also','just','like',
}

def _tokenize(text: str) -> list:
    """Tokenize text into lowercase words and bigrams."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    words = [w for w in text.split() if len(w) > 2]
    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
    trigrams = [f"{words[i]} {words[i+1]} {words[i+2]}" for i in range(len(words)-2)]
    return words + bigrams + trigrams


def _score(entry: dict, tokens: list) -> int:
    """
    Smart scoring: uses unique word matching to prevent crop-name inflation.
    Only counts non-generic words. Phrase matches get high bonus.
    """
    token_set = set(tokens)
    joined = " ".join(tokens)

    best_phrase_score = 0
    matched_words = set()

    for kw in entry["k"]:
        kw_lower = kw.lower()
        kw_words = kw_lower.split()

        # Exact multi-word phrase match (highest weight)
        if len(kw_words) >= 2 and kw_lower in joined:
            phrase_score = len(kw_words) * 5
            best_phrase_score = max(best_phrase_score, phrase_score)

        # Individual word matches — only count non-generic words ONCE
        for word in kw_words:
            if len(word) > 3 and word in token_set and word not in GENERIC_WORDS:
                matched_words.add(word)

    return best_phrase_score + len(matched_words)


def _kb_response(message: str) -> str:
    """Find best KB match using smart scoring."""
    tokens = _tokenize(message)
    scores = [(entry, _score(entry, tokens)) for entry in KB]
    scores.sort(key=lambda x: x[1], reverse=True)
    best_entry, best_score = scores[0]
    if best_score >= 3:
        return best_entry["r"]
    return None


def _smart_fallback(message: str) -> str:
    """Generate a contextual fallback when no KB match and no LLM available."""
    msg = message.lower()

    # Detect crop
    crop_map = {
        'tomato': '🍅', 'potato': '🥔', 'rice': '🌾', 'wheat': '🌾',
        'corn': '🌽', 'maize': '🌽', 'sugarcane': '🎋', 'banana': '🍌',
        'mango': '🥭', 'coffee': '☕', 'apple': '🍎', 'grape': '🍇',
        'pepper': '🌶️', 'soybean': '🫘', 'onion': '🧅', 'garlic': '🧄',
        'cucumber': '🥒', 'watermelon': '🍉', 'strawberry': '🍓',
    }
    detected_crop = None
    crop_emoji = '🌱'
    for crop, emoji in crop_map.items():
        if crop in msg:
            detected_crop = crop.capitalize()
            crop_emoji = emoji
            break

    # Detect topic
    if any(w in msg for w in ['disease','blight','rot','rust','mold','spot','lesion','infected','sick','dying','fungus','bacteria','virus']):
        topic = 'disease'
    elif any(w in msg for w in ['water','irrigat','drought','dry','wet','flood','rain']):
        topic = 'water'
    elif any(w in msg for w in ['fertiliz','npk','nitrogen','phosphorus','potassium','nutrient','manure','compost']):
        topic = 'fertilizer'
    elif any(w in msg for w in ['pest','insect','bug','aphid','mite','worm','borer','fly','beetle']):
        topic = 'pest'
    elif any(w in msg for w in ['harvest','pick','ripe','mature','yield','production']):
        topic = 'harvest'
    elif any(w in msg for w in ['grow','plant','cultivat','sow','seed','germinate']):
        topic = 'growing'
    elif any(w in msg for w in ['small','bigger','size','develop','fruit','flower','bloom']):
        topic = 'growth'
    else:
        topic = 'general'

    crop_str = f" for {detected_crop}" if detected_crop else ""

    responses = {
        'disease': f"{crop_emoji} I understand you're dealing with a disease issue{crop_str}. For accurate diagnosis, please **upload a photo** to the Diagnosis page — our AI will identify the exact disease.\n\nIn the meantime:\n1. **Isolate** affected plants from healthy ones\n2. **Remove** severely infected leaves/branches\n3. Apply a **broad-spectrum fungicide** (Mancozeb or Chlorothalonil) as a precaution\n4. Avoid overhead watering\n\nCan you describe the symptoms in more detail? (color of spots, which leaves are affected, any mold/powder visible?)",
        'water': f"💧 For watering{crop_str}, the key is **consistency**.\n\n**The Finger Test:** Push your finger 2 inches into soil:\n- Moist = don't water yet ✓\n- Dry = water now\n- Soggy = overwatered!\n\n**Best practice:** Water deeply every 2-3 days in the morning. Mulch around plants to retain moisture. Can you tell me more about your specific situation?",
        'fertilizer': f"🌱 For fertilization{crop_str}, the key nutrients are:\n- **Nitrogen (N):** Leafy growth — use Urea (46-0-0)\n- **Phosphorus (P):** Roots & flowers — use DAP (18-46-0)\n- **Potassium (K):** Fruit quality & disease resistance — use MOP (0-0-60)\n\nWhat specific issue are you seeing? (yellowing leaves, poor fruit, slow growth?) I can give more targeted advice!",
        'pest': f"🐛 For pest control{crop_str}:\n1. **Identify** the pest first (describe what you see)\n2. **Neem oil** (2%) — safe, broad-spectrum organic option\n3. **Insecticidal soap** — for soft-bodied insects\n4. **Imidacloprid** — systemic for severe infestations\n\nWhat does the pest look like? Where on the plant is it?",
        'harvest': f"🌾 For harvest timing{crop_str}, look for:\n- Full color development\n- Slight softness (for fruits)\n- Seeds/grains are hard\n- Plant leaves starting to yellow/dry\n\nWhat crop are you harvesting? I can give you specific maturity indicators!",
        'growing': f"{crop_emoji} For growing{crop_str} successfully:\n1. **Soil:** Test pH (ideal 6.0-7.0 for most crops)\n2. **Sunlight:** Most crops need 6-8 hours of direct sun\n3. **Water:** Consistent moisture, not waterlogged\n4. **Nutrients:** Balanced NPK fertilizer\n5. **Spacing:** Proper spacing for air circulation\n\nWhat specific aspect of growing are you asking about?",
        'growth': f"{crop_emoji} If your {detected_crop or 'plant'} isn't growing well, check these:\n1. **Temperature** — too hot or cold stops growth\n2. **Water** — both too much and too little cause stunting\n3. **Nutrients** — nitrogen deficiency causes slow growth\n4. **Soil pH** — wrong pH locks out nutrients\n5. **Light** — insufficient sunlight causes weak growth\n\nCan you describe what you're seeing? (yellowing, wilting, small fruits, etc.)",
        'general': f"{crop_emoji} I'm here to help with your farming questions{crop_str}! 🌿\n\nCould you provide more details about:\n- What crop you're growing\n- What problem or question you have\n- What symptoms you're observing\n\nThe more specific you are, the better advice I can give! You can also **upload a photo** to the Diagnosis page for AI-powered disease identification.",
    }
    return responses.get(topic, responses['general'])


async def generate_lian_response(message: str, history: list = None) -> tuple:
    """
    Main LiAn response generator.
    Priority: Gemini LLM → Groq LLM → KB scoring → Smart fallback
    Returns: (response_text, source)
    """
    # 1. Try Gemini first (primary LLM)
    gemini_reply = await _gemini_response(message, history)
    if gemini_reply:
        return gemini_reply, "gemini"

    # 2. Try Groq as secondary LLM
    groq_reply = await _groq_response(message, history)
    if groq_reply:
        return groq_reply, "groq"

    # 3. Try KB scoring engine
    kb_reply = _kb_response(message)
    if kb_reply:
        return kb_reply, "kb"

    # 4. Smart contextual fallback
    return _smart_fallback(message), "fallback"


async def _groq_response(message: str, history: list = None) -> str:
    """Groq LLM fallback."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    if not groq_key:
        return None
    try:
        from groq import Groq
        client = Groq(api_key=groq_key)
        messages = [{"role": "system", "content": "You are LiAn, an expert AI agricultural assistant. Answer any farming question with specific, actionable advice. Use emojis and markdown formatting."}]
        if history:
            for h in history[-6:]:
                messages.append({"role": h["role"], "content": h["content"]})
        messages.append({"role": "user", "content": message})
        response = client.chat.completions.create(model="llama3-70b-8192", messages=messages, temperature=0.7, max_tokens=600)
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.warning(f"Groq error: {e}")
        return None


# ── API Endpoints ─────────────────────────────────────────────────────────────

@router.post("/message")
async def send_message(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Send a message to LiAn and get a response."""
    message = request.message.strip()
    if not message:
        return {"reply": "Please type a message! 🌿", "source": "system", "timestamp": datetime.utcnow()}

    # Load recent conversation history for context
    recent = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.created_at.desc()).limit(10).all()

    history = [{"role": m.role, "content": m.content} for m in reversed(recent)]

    # Generate response
    reply, source = await generate_lian_response(message, history)

    # Save user message
    db.add(models.ChatMessage(user_id=current_user.id, role="user", content=message))
    # Save assistant response
    db.add(models.ChatMessage(user_id=current_user.id, role="assistant", content=reply))
    db.commit()

    return {
        "reply": reply,
        "source": source,
        "timestamp": datetime.utcnow(),
    }


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Get chat history for current user."""
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.created_at.asc()).limit(100).all()

    return [{"role": m.role, "content": m.content, "timestamp": m.created_at} for m in messages]


@router.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Clear chat history for current user."""
    db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).delete()
    db.commit()
    return {"message": "Chat history cleared"}


@router.get("/status")
def get_status():
    """Check LiAn's current LLM status."""
    gemini_active = bool(GEMINI_API_KEY and _get_gemini() is not None)
    groq_active = bool(os.getenv("GROQ_API_KEY", ""))
    return {
        "gemini": gemini_active,
        "groq": groq_active,
        "mode": "gemini" if gemini_active else ("groq" if groq_active else "kb"),
        "model": "gemini-2.5-flash" if gemini_active else ("llama3-70b" if groq_active else "KB Engine"),
        "kb_entries": len(KB),
        "status": "✅ Gemini AI Active" if gemini_active else ("✅ Groq LLM Active" if groq_active else "⚡ KB Engine Active"),
    }
