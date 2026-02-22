from fastapi import APIRouter
from typing import List, Optional

router = APIRouter(prefix="/api/tips", tags=["Cultivation Tips"])

CULTIVATION_TIPS = [
    {
        "id": 1,
        "crop": "Tomato",
        "emoji": "🍅",
        "category": "Vegetable",
        "difficulty": "Medium",
        "season": "Spring-Summer",
        "image": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400",
        "summary": "Tomatoes thrive in warm, sunny conditions with consistent moisture. They are the world's most popular garden vegetable.",
        "tips": [
            {"title": "Soil Preparation", "content": "Prepare well-draining soil with pH 6.0-6.8. Add compost (2-3 inches) and work it 12 inches deep. Tomatoes are heavy feeders and need rich, fertile soil."},
            {"title": "Planting", "content": "Plant transplants deep — bury 2/3 of the stem to develop extra roots. Space 18-36 inches apart. Plant after last frost when soil is at least 60°F (15°C)."},
            {"title": "Watering", "content": "Water deeply 1-2 inches per week. Use drip irrigation to keep foliage dry. Inconsistent watering causes blossom end rot and fruit cracking. Mulch to retain moisture."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer at planting. Switch to low-nitrogen, high-phosphorus fertilizer when flowering begins. Side-dress with calcium nitrate monthly to prevent blossom end rot."},
            {"title": "Pruning & Support", "content": "Remove suckers for indeterminate varieties. Stake or cage plants. Prune lower leaves to improve air circulation and reduce disease risk. Tie vines loosely to supports."},
            {"title": "Pest & Disease Management", "content": "Watch for early blight, late blight, and septoria leaf spot. Apply preventive fungicides in humid conditions. Monitor for hornworms and aphids. Rotate crops every 3 years."},
            {"title": "Harvesting", "content": "Harvest when fully colored and slightly soft to touch. Pick regularly to encourage more fruit production. Store at room temperature — never refrigerate as it destroys flavor."}
        ],
        "common_diseases": ["Early Blight", "Late Blight", "Bacterial Spot", "Septoria Leaf Spot", "Mosaic Virus"],
        "growing_time": "70-85 days",
        "yield": "10-15 lbs per plant"
    },
    {
        "id": 2,
        "crop": "Potato",
        "emoji": "🥔",
        "category": "Root Vegetable",
        "difficulty": "Easy",
        "season": "Spring-Fall",
        "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
        "summary": "Potatoes are versatile, cool-season crops that grow best in loose, well-drained soil. They are one of the world's most important food crops.",
        "tips": [
            {"title": "Seed Selection", "content": "Use certified disease-free seed potatoes. Cut large tubers into pieces with 2-3 eyes each. Allow cut surfaces to dry 1-2 days before planting to prevent rot."},
            {"title": "Planting", "content": "Plant 4 inches deep, 12 inches apart in rows 3 feet apart. Plant when soil temperature reaches 45°F (7°C). Avoid planting in recently limed soil which promotes scab."},
            {"title": "Hilling", "content": "Hill soil around plants when they reach 6-8 inches tall. Repeat every 2-3 weeks. Hilling prevents greening (solanine formation), increases yield, and protects tubers from light."},
            {"title": "Watering", "content": "Provide 1-2 inches of water per week. Consistent moisture is critical during tuber formation (flowering stage). Reduce watering as plants begin to die back to improve storage quality."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer at planting. Avoid excess nitrogen which promotes foliage over tubers. Side-dress with potassium for better tuber quality and disease resistance."},
            {"title": "Disease Prevention", "content": "Rotate crops every 3-4 years. Watch for late blight (most serious threat). Apply preventive fungicides in wet conditions. Remove volunteer plants which harbor diseases."},
            {"title": "Harvesting", "content": "Harvest 2-3 weeks after foliage dies back. Dig carefully to avoid bruising. Cure at 50-60°F for 2 weeks before storage to heal skin wounds and extend shelf life."}
        ],
        "common_diseases": ["Late Blight", "Early Blight", "Scab", "Blackleg", "Virus Diseases"],
        "growing_time": "70-120 days",
        "yield": "5-10 lbs per plant"
    },
    {
        "id": 3,
        "crop": "Corn",
        "emoji": "🌽",
        "category": "Grain",
        "difficulty": "Medium",
        "season": "Summer",
        "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
        "summary": "Corn is a warm-season crop that requires full sun, fertile soil, and consistent moisture. It is wind-pollinated and must be planted in blocks.",
        "tips": [
            {"title": "Site Selection", "content": "Choose a site with full sun (8+ hours). Corn is wind-pollinated, so plant in blocks of at least 4 rows rather than single rows for good pollination."},
            {"title": "Planting", "content": "Plant when soil temperature reaches 60°F (15°C). Sow seeds 1-2 inches deep, 9-12 inches apart. Thin to 12 inches if direct seeding. Avoid planting in cold, wet soil."},
            {"title": "Fertilization", "content": "Apply nitrogen-rich fertilizer at planting. Side-dress with additional nitrogen when plants are 12 inches tall (knee-high). Corn is a heavy nitrogen feeder — deficiency causes pale, stunted plants."},
            {"title": "Watering", "content": "Provide 1 inch of water per week. Critical periods: germination, tasseling, and silking. Drought during silking severely reduces yield. Mulch to retain moisture."},
            {"title": "Pollination", "content": "Tassels release pollen that must reach silks. Plant in blocks for best pollination. Each silk strand corresponds to one kernel. Hand-pollinate by shaking tassels over silks if needed."},
            {"title": "Pest Management", "content": "Watch for corn earworm, European corn borer, and rootworm. Apply Bt (Bacillus thuringiensis) for caterpillar control. Monitor for aphids and fall armyworm."},
            {"title": "Harvesting", "content": "Harvest when silks turn brown and kernels are plump. Pierce a kernel — milky juice indicates peak ripeness. Harvest in the morning for best flavor. Cook or freeze immediately."}
        ],
        "common_diseases": ["Gray Leaf Spot", "Northern Leaf Blight", "Common Rust", "Smut", "Ear Rot"],
        "growing_time": "60-100 days",
        "yield": "1-2 ears per plant"
    },
    {
        "id": 4,
        "crop": "Rice",
        "emoji": "🌾",
        "category": "Grain",
        "difficulty": "Medium",
        "season": "Summer (Kharif)",
        "image": "https://images.unsplash.com/photo-1536304993881-ff86e0c9b4b5?w=400",
        "summary": "Rice is the world's most important food crop, feeding over half the global population. It thrives in flooded paddies with warm temperatures and high humidity.",
        "tips": [
            {"title": "Nursery Preparation", "content": "Prepare a well-leveled nursery bed. Sow pre-germinated seeds at 40-50 kg/ha. Maintain 2-3 cm water depth. Seedlings are ready for transplanting in 20-25 days when 15-20 cm tall."},
            {"title": "Land Preparation & Transplanting", "content": "Puddle the field thoroughly to create an impermeable layer. Transplant 2-3 seedlings per hill, 20x15 cm spacing. Transplant in the morning or evening to reduce stress. Maintain 2-5 cm water depth after transplanting."},
            {"title": "Water Management", "content": "Maintain 2-5 cm standing water during vegetative stage. Drain field 7-10 days before harvest. Alternate wetting and drying (AWD) saves 30% water without yield loss. Never let field dry out during flowering."},
            {"title": "Fertilization", "content": "Apply NPK at recommended rates: 120-60-60 kg/ha for high-yielding varieties. Split nitrogen into 3 doses: basal, tillering, and panicle initiation. Apply silicon fertilizer to strengthen cell walls and reduce blast susceptibility."},
            {"title": "Weed Management", "content": "Weeds are the biggest yield robber in rice. Apply pre-emergence herbicide (butachlor) within 3 days of transplanting. Hand weed at 20 and 40 days after transplanting. Maintain water level to suppress weeds naturally."},
            {"title": "Disease & Pest Management", "content": "Monitor for rice blast (most serious disease) — apply tricyclazole at first sign. Watch for stem borers (dead heart symptom). Apply carbofuran granules for stem borer control. Scout fields twice weekly."},
            {"title": "Harvesting", "content": "Harvest when 80-85% of grains turn golden yellow. Grain moisture should be 20-25% at harvest. Delay causes shattering and quality loss. Thresh within 24 hours of harvest. Dry to 14% moisture for safe storage."}
        ],
        "common_diseases": ["Rice Blast", "Brown Spot", "Bacterial Leaf Blight", "Sheath Blight", "False Smut"],
        "growing_time": "90-150 days",
        "yield": "4-8 tons per hectare"
    },
    {
        "id": 5,
        "crop": "Wheat",
        "emoji": "🌾",
        "category": "Grain",
        "difficulty": "Medium",
        "season": "Winter (Rabi)",
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
        "summary": "Wheat is the world's most widely grown cereal crop, providing 20% of global calories. It is a cool-season crop grown in winter in most regions.",
        "tips": [
            {"title": "Variety Selection", "content": "Choose varieties suited to your region and season. Consider disease resistance (especially rust resistance). High-yielding varieties (HYVs) like HD-2967, PBW-343 give best results. Check local agricultural extension recommendations."},
            {"title": "Seed Treatment & Planting", "content": "Treat seeds with Carbendazim (2g/kg) + Thiram (2g/kg) before planting. Sow at 100-125 kg/ha seed rate. Optimal sowing depth: 5-6 cm. Row spacing: 22-23 cm. Sow when soil temperature is 55-65°F (13-18°C)."},
            {"title": "Fertilization", "content": "Apply NPK at 120-60-40 kg/ha. Apply full phosphorus and potassium at sowing. Split nitrogen: 50% at sowing, 25% at first irrigation (CRI stage), 25% at tillering. Sulfur (20 kg/ha) improves protein content."},
            {"title": "Irrigation", "content": "Wheat needs 4-6 irrigations. Critical stages: Crown Root Initiation (CRI) at 20-25 days, tillering, jointing, flowering, and grain filling. Avoid waterlogging. Deficit irrigation at grain filling reduces yield significantly."},
            {"title": "Weed Management", "content": "Weeds reduce wheat yield by 20-40%. Apply Clodinafop (for narrow-leaf weeds) or Metsulfuron (for broad-leaf weeds) at 30-35 days after sowing. Manual weeding at 30 and 60 days is effective for small farms."},
            {"title": "Disease Management", "content": "Yellow rust is the most dangerous — apply Tebuconazole or Propiconazole at first sign. Brown rust: apply triazole fungicides. Powdery mildew: apply sulfur fungicide. Loose smut: use hot water treated seeds. Scout fields weekly from tillering."},
            {"title": "Harvesting", "content": "Harvest when grain moisture is 12-14% and straw turns golden. Combine harvesting is most efficient. Thresh immediately after cutting to prevent field losses. Dry grain to 12% moisture before storage."}
        ],
        "common_diseases": ["Yellow Rust", "Brown Rust", "Powdery Mildew", "Fusarium Head Blight", "Loose Smut"],
        "growing_time": "120-150 days",
        "yield": "3-6 tons per hectare"
    },
    {
        "id": 6,
        "crop": "Sugarcane",
        "emoji": "🎋",
        "category": "Cash Crop",
        "difficulty": "Hard",
        "season": "Year-round (tropical)",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        "summary": "Sugarcane is the world's largest crop by production tonnage, grown for sugar, ethanol, and fiber. It requires 12-18 months to mature and is a major cash crop.",
        "tips": [
            {"title": "Sett Selection & Treatment", "content": "Use disease-free setts (stem cuttings) with 2-3 buds each. Treat setts with hot water at 50°C for 2 hours to eliminate pathogens. Treat with Carbendazim (0.1%) fungicide before planting. Use certified planting material from reputable nurseries."},
            {"title": "Land Preparation & Planting", "content": "Deep plow to 30-45 cm depth. Make furrows 90-120 cm apart, 25-30 cm deep. Place setts end-to-end in furrows. Cover with 5-7 cm soil. Plant at the start of the rainy season or with irrigation available."},
            {"title": "Irrigation Management", "content": "Sugarcane needs 1500-2500 mm water per season. Critical periods: germination, tillering, and grand growth phase. Drip irrigation saves 30-40% water and increases yield. Avoid waterlogging — increases red rot susceptibility."},
            {"title": "Fertilization", "content": "Apply NPK at 250-100-120 kg/ha for plant crop. Split nitrogen into 3 doses. Apply zinc sulfate (25 kg/ha) if deficiency observed. Trash mulching (leaving crop residue) reduces fertilizer needs by 20%."},
            {"title": "Ratoon Management", "content": "After harvest, allow ratoon (regrowth) crop. Apply nitrogen fertilizer immediately after harvest. Gap-fill missing plants. Ratoon crops are more economical but yield decreases after 2-3 ratoons. Replant after 3 ratoons."},
            {"title": "Disease Management", "content": "Red rot is the most serious disease — use resistant varieties and hot water treated setts. Smut: rogue out infected plants immediately before spores spread. Wilt: improve drainage. Regular field monitoring is essential."},
            {"title": "Harvesting", "content": "Test Brix (sucrose content) with refractometer — harvest when 18-20%. Harvest in cool weather (morning) for best quality. Cut stalks at ground level. Remove trash (dry leaves) before or after harvest. Process within 24-48 hours for maximum sugar recovery."}
        ],
        "common_diseases": ["Red Rot", "Smut", "Wilt", "Ratoon Stunting Disease", "Leaf Scald"],
        "growing_time": "12-18 months",
        "yield": "60-100 tons per hectare"
    },
    {
        "id": 7,
        "crop": "Banana",
        "emoji": "🍌",
        "category": "Fruit Tree",
        "difficulty": "Medium",
        "season": "Year-round (tropical)",
        "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
        "summary": "Bananas are one of the world's most popular fruits, grown in tropical regions. They produce fruit year-round and are highly nutritious with potassium and vitamins.",
        "tips": [
            {"title": "Planting Material", "content": "Use disease-free tissue culture (TC) plants for best results — they are virus-free and uniform. Alternatively, use sword suckers (preferred) or water suckers from healthy mother plants. Avoid planting material from diseased fields."},
            {"title": "Planting & Spacing", "content": "Plant in pits 60x60x60 cm filled with compost and topsoil. Spacing: 1.8x1.8 m (high density) to 3x3 m (standard). Plant at the start of rainy season. Ensure good drainage — bananas cannot tolerate waterlogging."},
            {"title": "Irrigation & Water Management", "content": "Bananas need 1500-2500 mm water annually. Drip irrigation is ideal — apply 40-60 liters per plant per day in summer. Mulch heavily to conserve moisture. Avoid waterlogging which promotes Panama disease and root rot."},
            {"title": "Fertilization", "content": "Bananas are heavy feeders. Apply NPK at 200-60-300 g per plant per year. Split into 4-6 doses. Potassium is most critical for fruit quality and yield. Apply micronutrients (zinc, boron) if deficiency observed."},
            {"title": "Desuckering & Propping", "content": "Allow only one ratoon sucker per plant. Remove all other suckers regularly. Prop plants with bamboo poles when bunch emerges to prevent lodging. Remove dry leaves regularly to reduce pest and disease habitat."},
            {"title": "Disease Management", "content": "Panama disease (Fusarium wilt): use resistant varieties, no chemical cure. Black Sigatoka: apply fungicides (propiconazole, mancozeb) on regular schedule. Bunchy Top Virus: control aphid vectors, remove infected plants immediately."},
            {"title": "Harvesting", "content": "Harvest when fingers are plump and rounded (75-80% maturity for export, 90% for local market). Cut the bunch with a sharp knife. Handle carefully to avoid bruising. Ripen at room temperature. One plant produces one bunch per year."}
        ],
        "common_diseases": ["Panama Disease", "Black Sigatoka", "Bunchy Top Virus", "Anthracnose", "Xanthomonas Wilt"],
        "growing_time": "9-12 months",
        "yield": "20-40 tons per hectare"
    },
    {
        "id": 8,
        "crop": "Mango",
        "emoji": "🥭",
        "category": "Fruit Tree",
        "difficulty": "Medium",
        "season": "Summer (harvest)",
        "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
        "summary": "Mango is the 'King of Fruits', grown in tropical and subtropical regions. Trees are long-lived and productive for 40+ years with proper management.",
        "tips": [
            {"title": "Variety Selection", "content": "Choose varieties suited to your climate. Popular varieties: Alphonso (India), Tommy Atkins (export), Kent, Keitt, Haden. Consider disease resistance, fruit quality, and market demand. Grafted plants fruit in 3-4 years vs 6-8 years for seedlings."},
            {"title": "Planting", "content": "Plant grafted seedlings in pits 1x1x1 m filled with compost and topsoil. Spacing: 8-10 m for standard varieties, 5-6 m for high-density planting. Plant at the start of rainy season. Stake young trees to prevent wind damage."},
            {"title": "Irrigation", "content": "Young trees need regular irrigation. Mature trees are drought-tolerant but need irrigation during flowering and fruit development. Withhold irrigation 2-3 months before expected flowering to induce flowering. Drip irrigation is most efficient."},
            {"title": "Fertilization", "content": "Apply NPK at 1-2 kg per tree per year of age (up to 10 years). Apply potassium-rich fertilizer before flowering to improve fruit quality. Foliar spray of potassium nitrate (1%) induces uniform flowering. Micronutrients (zinc, boron) improve fruit set."},
            {"title": "Pruning & Canopy Management", "content": "Prune after harvest to maintain open canopy. Remove dead, diseased, and crossing branches. Maintain 3-4 main scaffold branches. Proper pruning improves light penetration, air circulation, and reduces disease."},
            {"title": "Disease & Pest Management", "content": "Anthracnose: apply copper fungicide + mancozeb from flowering. Powdery mildew: apply sulfur at flower emergence. Mango hopper: apply imidacloprid at bud break. Fruit fly: use protein bait traps. Bag fruits to prevent anthracnose and fruit fly damage."},
            {"title": "Harvesting", "content": "Harvest when fruit changes color and gives slightly to pressure. Mature green mangoes can be harvested for ripening. Cut with 5-10 cm stalk to prevent sap burn. Handle carefully to avoid bruising. Ripen at room temperature (25-30°C)."}
        ],
        "common_diseases": ["Anthracnose", "Powdery Mildew", "Bacterial Canker", "Stem End Rot", "Malformation"],
        "growing_time": "3-4 years to first fruit",
        "yield": "10-20 tons per hectare (mature orchard)"
    },
    {
        "id": 9,
        "crop": "Coffee",
        "emoji": "☕",
        "category": "Cash Crop",
        "difficulty": "Hard",
        "season": "Year-round (harvest: Oct-Feb)",
        "image": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
        "summary": "Coffee is one of the world's most valuable agricultural commodities. Arabica coffee grows at high altitudes with cool temperatures and shade.",
        "tips": [
            {"title": "Variety Selection", "content": "Arabica: higher quality, grown at 1000-2000m altitude, susceptible to leaf rust. Robusta: lower quality, grown at lower altitudes, more disease resistant. Hybrid varieties (Catimor, Sarchimor) offer rust resistance with good quality."},
            {"title": "Nursery & Planting", "content": "Raise seedlings in nursery for 6-12 months. Plant in pits 60x60x60 cm with compost. Spacing: 2x2 m to 3x3 m depending on variety. Plant at start of rainy season. Provide shade (30-50%) especially for young plants."},
            {"title": "Shade Management", "content": "Coffee grows best under partial shade (30-50%). Use shade trees like Grevillea, Albizzia, or Leucaena. Shade reduces temperature stress, improves cup quality, and reduces pest pressure. Remove excess shade as plants mature."},
            {"title": "Fertilization", "content": "Apply NPK at 200-100-200 g per plant per year. Split into 2-3 doses. Nitrogen is most critical for vegetative growth. Potassium improves bean quality and disease resistance. Foliar micronutrient sprays (zinc, boron) improve yield."},
            {"title": "Pruning", "content": "Single stem pruning: maintain one main stem. Multiple stem pruning: allow 3-4 stems. Prune after harvest to remove dead wood and improve light penetration. Stumping (cutting to 30 cm) rejuvenates old, unproductive trees."},
            {"title": "Disease Management", "content": "Coffee Leaf Rust (most important): apply copper fungicides preventively, use resistant varieties. Coffee Berry Disease (CBD): apply copper fungicides at critical stages, harvest all ripe berries promptly. Wilt: improve drainage, use resistant rootstocks."},
            {"title": "Harvesting & Processing", "content": "Selective picking (only ripe red cherries) gives best quality. Strip picking is faster but lower quality. Wet processing (washing): removes pulp, ferments, washes — produces clean, bright coffee. Dry processing (natural): dry whole cherries — produces fruity, complex coffee."}
        ],
        "common_diseases": ["Coffee Leaf Rust", "Coffee Berry Disease", "Wilt", "Root Rot", "Bacterial Blight"],
        "growing_time": "3-4 years to first harvest",
        "yield": "1-3 tons green beans per hectare"
    },
    {
        "id": 10,
        "crop": "Apple",
        "emoji": "🍎",
        "category": "Fruit Tree",
        "difficulty": "Hard",
        "season": "Year-round (harvest: Fall)",
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
        "summary": "Apple trees require careful management but reward with decades of fruit production. They need chilling hours in winter to break dormancy and flower properly.",
        "tips": [
            {"title": "Variety Selection", "content": "Choose varieties suited to your climate zone. Most apples need a pollinator variety. Consider disease-resistant varieties like Liberty, Enterprise, or Honeycrisp. Check chill hour requirements for your region."},
            {"title": "Planting", "content": "Plant in well-drained soil with full sun. Space standard trees 20-25 feet apart, dwarf trees 8-10 feet. Plant in early spring or fall. Avoid frost pockets and low-lying areas."},
            {"title": "Pruning", "content": "Prune during dormancy (late winter). Remove crossing branches, water sprouts, and dead wood. Maintain open center or central leader form for light penetration. Annual pruning is essential for productivity."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer in early spring. Avoid excess nitrogen which promotes vegetative growth over fruiting. Foliar calcium sprays prevent bitter pit. Soil test every 3 years."},
            {"title": "Thinning", "content": "Thin fruits to 6 inches apart when marble-sized. Thinning improves fruit size, quality, and prevents biennial bearing. Chemical thinning (carbaryl, NAA) is used commercially."},
            {"title": "Pest & Disease Management", "content": "Apply dormant oil spray before bud break. Follow a spray schedule for apple scab, fire blight, and codling moth. Use pheromone traps for monitoring. Sanitation (removing fallen fruit) reduces pest pressure."},
            {"title": "Harvesting", "content": "Harvest when fruits separate easily with an upward twist. Check seed color (brown = ripe). Store in cool, humid conditions (32-35°F). Different varieties have different storage lives."}
        ],
        "common_diseases": ["Apple Scab", "Fire Blight", "Cedar Apple Rust", "Powdery Mildew", "Black Rot"],
        "growing_time": "3-5 years to first fruit",
        "yield": "400-800 lbs per mature tree"
    },
    {
        "id": 11,
        "crop": "Grape",
        "emoji": "🍇",
        "category": "Fruit Vine",
        "difficulty": "Hard",
        "season": "Summer-Fall",
        "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400",
        "summary": "Grapes require a trellis system, annual pruning, and disease management for quality fruit. They are grown for fresh eating, wine, raisins, and juice.",
        "tips": [
            {"title": "Site & Soil", "content": "Plant on south-facing slopes for maximum sun. Well-drained soil is essential — grapes hate wet feet. pH 5.5-6.5. Avoid frost pockets. Good air circulation reduces disease pressure."},
            {"title": "Trellis System", "content": "Install trellis before planting. Common systems: VSP (Vertical Shoot Positioning), Geneva Double Curtain, or Pergola. Posts every 20 feet with wire at 3 and 5 feet."},
            {"title": "Pruning", "content": "Prune heavily in late winter — remove 80-90% of previous year's growth. Cane or spur pruning depending on variety. Proper pruning is the most important management practice for grapes."},
            {"title": "Disease Management", "content": "Apply fungicides from bud break through veraison. Key diseases: black rot, powdery mildew, downy mildew. Canopy management improves air circulation and reduces disease pressure significantly."},
            {"title": "Irrigation", "content": "Drip irrigation is ideal. Water stress during berry development reduces yield. Avoid irrigation near harvest to concentrate sugars and improve wine quality."},
            {"title": "Harvesting", "content": "Test Brix (sugar content) with a refractometer. Table grapes: 16-18 Brix. Wine grapes: 20-26 Brix. Taste test is the best indicator. Harvest in the morning for best quality."}
        ],
        "common_diseases": ["Black Rot", "Powdery Mildew", "Downy Mildew", "Botrytis", "Esca"],
        "growing_time": "3 years to first harvest",
        "yield": "15-20 lbs per vine"
    },
    {
        "id": 12,
        "crop": "Strawberry",
        "emoji": "🍓",
        "category": "Berry",
        "difficulty": "Easy",
        "season": "Spring-Summer",
        "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
        "summary": "Strawberries are easy to grow and produce fruit quickly, perfect for beginners. They are the most popular berry fruit worldwide.",
        "tips": [
            {"title": "Variety Selection", "content": "June-bearing: large crop once per year. Everbearing: two crops per year. Day-neutral: continuous production. Choose based on your goals and climate."},
            {"title": "Planting", "content": "Plant in early spring. Set crown at soil level — too deep causes rot, too shallow causes drying. Space 12-18 inches apart in rows 3 feet apart. Raised beds improve drainage."},
            {"title": "Mulching", "content": "Apply 2-3 inches of straw mulch. Mulch keeps berries clean, retains moisture, prevents weeds, and protects crowns from frost. Remove mulch in spring to allow growth."},
            {"title": "Runner Management", "content": "Remove runners the first year to encourage plant establishment. Allow runners to root in subsequent years to renew the bed. Replace beds every 3-4 years for best production."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer after harvest. Avoid excess nitrogen which promotes foliage over fruit. Foliar boron spray improves fruit set. Calcium is important for fruit firmness."},
            {"title": "Harvesting", "content": "Harvest when fully red and slightly soft. Pick every 2-3 days during peak season. Handle gently to avoid bruising. Refrigerate immediately after picking for best shelf life."}
        ],
        "common_diseases": ["Gray Mold (Botrytis)", "Leaf Scorch", "Powdery Mildew", "Anthracnose", "Verticillium Wilt"],
        "growing_time": "60-90 days from transplant",
        "yield": "1-2 quarts per plant"
    },
    {
        "id": 13,
        "crop": "Pepper",
        "emoji": "\U0001f336\ufe0f",
        "category": "Vegetable",
        "difficulty": "Medium",
        "season": "Summer",
        "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
        "summary": "Peppers love heat and sun, producing colorful fruits from summer through fall. They range from sweet bell peppers to fiery hot chilis.",
        "tips": [
            {"title": "Starting Seeds", "content": "Start seeds indoors 8-10 weeks before last frost. Germination requires 80-85 degrees F soil temperature. Use heat mat for best results. Peppers are slow to germinate."},
            {"title": "Transplanting", "content": "Transplant after last frost when nights stay above 55 degrees F. Space 18 inches apart. Harden off seedlings for 1 week before transplanting. Peppers are very sensitive to cold."},
            {"title": "Watering", "content": "Water consistently 1-2 inches per week. Inconsistent watering causes blossom drop and blossom end rot. Mulch to retain moisture. Avoid wetting foliage to reduce disease."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer at planting. Switch to low-nitrogen fertilizer when flowering. Calcium and magnesium are important for pepper quality and preventing blossom end rot."},
            {"title": "Pest Management", "content": "Watch for aphids, spider mites, and pepper weevil. Apply insecticidal soap for soft-bodied insects. Imidacloprid for systemic control. Row covers protect young plants from insects."},
            {"title": "Harvesting", "content": "Harvest green peppers when full-sized. Allow to ripen to red, yellow, or orange for sweeter flavor and higher vitamin C content. Use scissors to avoid damaging plants."}
        ],
        "common_diseases": ["Bacterial Spot", "Phytophthora Blight", "Anthracnose", "Mosaic Virus", "Cercospora Leaf Spot"],
        "growing_time": "70-90 days",
        "yield": "5-10 lbs per plant"
    },
    {
        "id": 14,
        "crop": "Soybean",
        "emoji": "\U0001fad8",
        "category": "Legume",
        "difficulty": "Easy",
        "season": "Summer",
        "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
        "summary": "Soybeans are nitrogen-fixing legumes that improve soil health while providing high-protein yield. They are a major global commodity crop.",
        "tips": [
            {"title": "Inoculation", "content": "Inoculate seeds with Bradyrhizobium japonicum before planting, especially in fields where soybeans have not been grown before. This maximizes nitrogen fixation and reduces fertilizer needs."},
            {"title": "Planting", "content": "Plant when soil temperature reaches 55 degrees F. Sow 1-1.5 inches deep, 2-4 inches apart. Rows 15-30 inches apart. Avoid planting in cold, wet soils which cause poor germination."},
            {"title": "Weed Control", "content": "Soybeans are poor competitors early on. Control weeds in the first 4-6 weeks. Use pre-emergent herbicides or cultivation. Weed-free first 30 days is critical for yield."},
            {"title": "Fertilization", "content": "Soybeans fix their own nitrogen. Apply phosphorus and potassium based on soil test. Avoid excess nitrogen which reduces nodulation. Sulfur (20 kg/ha) improves protein content."},
            {"title": "Harvesting", "content": "Harvest when pods are yellow-brown and seeds rattle. Moisture should be 13-15 percent for safe storage. Combine carefully to minimize seed damage. Dry to 12 percent moisture if needed for long-term storage."}
        ],
        "common_diseases": ["Sudden Death Syndrome", "Soybean Cyst Nematode", "Phytophthora Root Rot", "Frogeye Leaf Spot", "White Mold"],
        "growing_time": "80-120 days",
        "yield": "40-60 bushels per acre"
    },
    {
        "id": 15,
        "crop": "Onion",
        "emoji": "\U0001f9c5",
        "category": "Vegetable",
        "difficulty": "Medium",
        "season": "Fall-Spring",
        "image": "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
        "summary": "Onions are essential culinary vegetables grown worldwide. They require cool temperatures for bulb development and are excellent for long-term storage.",
        "tips": [
            {"title": "Variety Selection", "content": "Short-day varieties: for southern regions, bulb when days are 10-12 hours. Long-day varieties: for northern regions, bulb when days are 14-16 hours. Day-neutral varieties: adaptable to most regions."},
            {"title": "Planting", "content": "Start from seeds, sets (small bulbs), or transplants. Plant sets 1 inch deep, 4-6 inches apart. Rows 12-18 inches apart. Plant in early spring (long-day) or fall (short-day)."},
            {"title": "Fertilization", "content": "Apply nitrogen at 100-150 kg/ha. Split into 3 doses: at planting, 30 days, and 60 days. Stop nitrogen when bulbs begin to swell. Excess nitrogen delays maturity and reduces storage quality."},
            {"title": "Irrigation", "content": "Onions have shallow roots. Water frequently but lightly. Provide 1 inch per week. Reduce irrigation when tops begin to fall over. Stop irrigation 2 weeks before harvest to improve storage quality."},
            {"title": "Disease Management", "content": "Purple blotch: apply mancozeb or iprodione. Downy mildew: apply metalaxyl plus mancozeb. Botrytis neck rot: apply iprodione at harvest. Fusarium basal rot: use disease-free sets, crop rotation."},
            {"title": "Harvesting and Curing", "content": "Harvest when 50-75 percent of tops have fallen over. Pull or dig bulbs carefully. Cure in field for 7-10 days or in ventilated shed. Curing dries outer scales and neck, extending storage life to 6-8 months."}
        ],
        "common_diseases": ["Purple Blotch", "Downy Mildew", "Botrytis Neck Rot", "Fusarium Basal Rot", "Thrips"],
        "growing_time": "90-120 days",
        "yield": "20-40 tons per hectare"
    },
    {
        "id": 16,
        "crop": "Carrot",
        "emoji": "\U0001f955",
        "category": "Root Vegetable",
        "difficulty": "Easy",
        "season": "Spring-Fall",
        "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
        "summary": "Carrots are nutritious root vegetables that grow best in loose, deep, well-drained soil. They are excellent for fresh eating, juicing, and long-term storage.",
        "tips": [
            {"title": "Soil Preparation", "content": "Carrots need loose, deep, stone-free soil to develop straight roots. Till to 12-15 inches deep. Remove rocks and clods. Sandy loam is ideal. Avoid fresh manure which causes forking."},
            {"title": "Planting", "content": "Direct sow seeds 1/4 inch deep, 2-3 inches apart. Rows 12-18 inches apart. Germination takes 14-21 days. Keep soil moist during germination. Thin to 3-4 inches apart when seedlings are 2 inches tall."},
            {"title": "Watering", "content": "Provide consistent moisture 1 inch per week. Inconsistent watering causes cracking and forking. Mulch to retain moisture. Reduce watering slightly as roots mature to concentrate sugars."},
            {"title": "Fertilization", "content": "Apply phosphorus and potassium at planting. Avoid excess nitrogen which promotes foliage over roots. Side-dress with potassium when roots begin to develop. Boron deficiency causes hollow heart."},
            {"title": "Harvesting", "content": "Harvest when roots are 3/4 to 1 inch in diameter. Loosen soil with fork before pulling. Flavor improves after light frost. Twist off tops immediately after harvest. Store in cool, humid conditions."}
        ],
        "common_diseases": ["Alternaria Leaf Blight", "Cavity Spot", "Carrot Fly", "Powdery Mildew", "Aster Yellows"],
        "growing_time": "70-80 days",
        "yield": "25-40 tons per hectare"
    },
    {
        "id": 17,
        "crop": "Cucumber",
        "emoji": "\U0001f952",
        "category": "Vegetable",
        "difficulty": "Easy",
        "season": "Summer",
        "image": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400",
        "summary": "Cucumbers are fast-growing warm-season vegetables that produce abundantly with proper care. They are excellent for fresh eating, pickling, and salads.",
        "tips": [
            {"title": "Planting", "content": "Direct sow after last frost when soil is 65 degrees F or above. Plant 1 inch deep, 6 inches apart. Thin to 12 inches. Or start indoors 3-4 weeks before transplanting."},
            {"title": "Trellis and Support", "content": "Train vining cucumbers up a trellis or fence. Trellising improves air circulation, reduces disease, and makes harvesting easier. Bush varieties do not need support."},
            {"title": "Watering", "content": "Cucumbers are 95 percent water. Consistent moisture is critical. Provide 1-2 inches per week. Inconsistent watering causes bitter fruit. Water at base to keep foliage dry."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer at planting. Side-dress with nitrogen when vines begin to run. Avoid excess nitrogen after flowering. Calcium and magnesium are important for fruit quality."},
            {"title": "Harvesting", "content": "Harvest frequently every 2-3 days. Pick when 6-8 inches long for slicing types, 2-4 inches for pickling. Overripe cucumbers turn yellow and signal the plant to stop producing."}
        ],
        "common_diseases": ["Powdery Mildew", "Downy Mildew", "Angular Leaf Spot", "Cucumber Mosaic Virus", "Anthracnose"],
        "growing_time": "50-70 days",
        "yield": "10-20 kg per plant"
    },
    {
        "id": 18,
        "crop": "Watermelon",
        "emoji": "\U0001f349",
        "category": "Fruit Vine",
        "difficulty": "Medium",
        "season": "Summer",
        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
        "summary": "Watermelons are warm-season fruits that need plenty of space, heat, and sunshine. They are 92 percent water and packed with lycopene and vitamins.",
        "tips": [
            {"title": "Site and Soil", "content": "Choose a site with full sun and well-drained, sandy loam soil. pH 6.0-6.8. Watermelons need warm soil (70 degrees F or above) and air temperatures. Black plastic mulch warms soil and suppresses weeds."},
            {"title": "Planting", "content": "Start seeds indoors 3-4 weeks before transplanting. Transplant after last frost. Space plants 3-5 feet apart in rows 6-8 feet apart. Seedless varieties need a pollinator variety."},
            {"title": "Irrigation", "content": "Provide 1-2 inches per week. Drip irrigation is ideal. Reduce watering as fruits approach maturity to concentrate sugars. Avoid wetting foliage. Inconsistent watering causes hollow heart and cracking."},
            {"title": "Fertilization", "content": "Apply balanced fertilizer at planting. Side-dress with potassium when vines begin to run. Avoid excess nitrogen after flowering which promotes foliage over fruit."},
            {"title": "Ripeness Testing", "content": "Thump test: ripe watermelons produce a deep, hollow sound. Check the ground spot which should turn from white to creamy yellow. The tendril nearest the fruit should be dry and brown."}
        ],
        "common_diseases": ["Fusarium Wilt", "Anthracnose", "Powdery Mildew", "Gummy Stem Blight", "Mosaic Virus"],
        "growing_time": "70-90 days",
        "yield": "20-30 tons per hectare"
    },
    {
        "id": 19,
        "crop": "Garlic",
        "emoji": "\U0001f9c4",
        "category": "Vegetable",
        "difficulty": "Easy",
        "season": "Fall-Spring",
        "image": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400",
        "summary": "Garlic is one of the oldest cultivated plants, prized for culinary and medicinal uses. It is planted in fall and harvested in summer.",
        "tips": [
            {"title": "Variety Selection", "content": "Hardneck varieties: more complex flavor, produce scapes, better for cold climates. Softneck varieties: longer storage, better for warm climates, used for braiding. Elephant garlic: milder flavor, very large cloves."},
            {"title": "Planting", "content": "Plant individual cloves 2 inches deep, 6 inches apart, pointed end up. Rows 12 inches apart. Plant in fall 4-6 weeks before ground freezes for spring harvest."},
            {"title": "Mulching", "content": "Apply 4-6 inches of straw mulch after planting. Mulch insulates against freeze-thaw cycles, retains moisture, and suppresses weeds. Remove mulch in spring when shoots emerge."},
            {"title": "Scape Removal", "content": "Remove scapes (flower stalks) from hardneck varieties when they curl. Removing scapes redirects energy to bulb development, increasing yield by 20-30 percent. Scapes are edible and delicious."},
            {"title": "Harvesting and Curing", "content": "Harvest when lower 3-4 leaves have turned brown (usually June-July). Dig carefully to avoid bruising. Cure in a warm, dry, well-ventilated area for 3-4 weeks. Properly cured garlic stores for 6-12 months."}
        ],
        "common_diseases": ["White Rot", "Botrytis Neck Rot", "Rust", "Downy Mildew", "Fusarium Basal Rot"],
        "growing_time": "240-270 days (fall planted)",
        "yield": "8-12 tons per hectare"
    },
    {
        "id": 20,
        "crop": "Cabbage",
        "emoji": "\U0001f96c",
        "category": "Vegetable",
        "difficulty": "Easy",
        "season": "Spring-Fall",
        "image": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400",
        "summary": "Cabbage is a cool-season vegetable packed with vitamins C and K. It is versatile in the kitchen and stores well for months in cool conditions.",
        "tips": [
            {"title": "Planting", "content": "Start seeds indoors 6-8 weeks before transplanting. Transplant when seedlings have 4-5 true leaves. Space 12-24 inches apart depending on variety. Plant in early spring or late summer for fall harvest."},
            {"title": "Soil and Fertilization", "content": "Cabbage prefers fertile, well-drained soil with pH 6.5-7.0. Apply nitrogen-rich fertilizer at planting and side-dress when heads begin to form. Calcium is important to prevent tip burn."},
            {"title": "Watering", "content": "Provide consistent moisture 1-1.5 inches per week. Inconsistent watering causes heads to crack. Mulch to retain moisture. Avoid overhead irrigation to reduce disease."},
            {"title": "Pest Management", "content": "Cabbage worm and cabbage looper: apply Bt (Bacillus thuringiensis). Aphids: insecticidal soap. Cabbage root fly: use row covers. Flea beetles: diatomaceous earth or row covers."},
            {"title": "Harvesting", "content": "Harvest when heads are firm and solid. Cut at base with sharp knife. Leave outer leaves on for protection. Cabbage stores well in cool, humid conditions (32-35 degrees F) for 3-6 months."}
        ],
        "common_diseases": ["Clubroot", "Black Rot", "Downy Mildew", "Alternaria Leaf Spot", "Fusarium Yellows"],
        "growing_time": "70-120 days",
        "yield": "30-50 tons per hectare"
    }
]


@router.get("")
def get_all_tips(category: Optional[str] = None, difficulty: Optional[str] = None):
    tips = CULTIVATION_TIPS
    if category:
        tips = [t for t in tips if t["category"].lower() == category.lower()]
    if difficulty:
        tips = [t for t in tips if t["difficulty"].lower() == difficulty.lower()]
    return tips


@router.get("/crop/{crop_name}")
def get_tip_by_crop(crop_name: str):
    from fastapi import HTTPException
    tip = next((t for t in CULTIVATION_TIPS if t["crop"].lower() == crop_name.lower()), None)
    if not tip:
        raise HTTPException(status_code=404, detail=f"No tips found for {crop_name}")
    return tip


@router.get("/{crop_identifier}")
def get_tip(crop_identifier: str):
    from fastapi import HTTPException
    try:
        crop_id = int(crop_identifier)
        tip = next((t for t in CULTIVATION_TIPS if t["id"] == crop_id), None)
    except ValueError:
        tip = next(
            (t for t in CULTIVATION_TIPS if t["crop"].lower() == crop_identifier.lower()),
            None
        )
    if not tip:
        raise HTTPException(status_code=404, detail=f"Crop tip not found: {crop_identifier}")
    return tip


@router.get("/categories/list")
def get_categories():
    categories = list(set(t["category"] for t in CULTIVATION_TIPS))
    return {"categories": sorted(categories)}
