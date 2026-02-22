export const DISEASE_DB = {
  'Apple Scab': {
    desc: 'Fungal disease (Venturia inaequalis) creating dark scabby lesions on leaves and fruit, reducing yield and marketability.',
    spread: 'Spreads through fungal spores during wet spring weather via wind and rain splash from infected fallen leaves.',
    organic: ['Apply sulfur fungicide every 7-10 days in wet periods', 'Use neem oil as preventive spray', 'Remove and destroy fallen leaves in autumn'],
    chemical: ['Captan fungicide at bud break', 'Myclobutanil — systemic fungicide', 'Mancozeb — protective fungicide'],
    prevention: ['Plant resistant varieties (Liberty, Enterprise)', 'Prune for good air circulation', 'Rake and destroy fallen leaves', 'Avoid overhead irrigation'],
  },
  'Tomato Late Blight': {
    desc: 'Caused by Phytophthora infestans — same pathogen as the Irish Potato Famine. Creates dark water-soaked lesions that destroy entire plants within days.',
    spread: 'Spreads extremely rapidly through airborne spores in cool wet conditions (60-70°F). Can destroy a field in days. Spores travel miles by wind.',
    organic: ['Remove and destroy infected plants immediately', 'Apply copper hydroxide spray preventively', 'Improve air circulation by staking plants'],
    chemical: ['Metalaxyl — most effective systemic', 'Chlorothalonil — protective', 'Mancozeb + cymoxanil combination'],
    prevention: ['Use certified disease-free transplants', 'Avoid overhead irrigation', 'Plant resistant varieties', 'Monitor weather for blight conditions'],
  },
  'Tomato Early Blight': {
    desc: 'Caused by Alternaria solani. Produces target-like brown spots with concentric rings on lower leaves, progressing upward through the plant.',
    spread: 'Spreads through spores in soil and infected debris. Warm temperatures (75-85°F) and high humidity favor spread. Splashing water moves spores.',
    organic: ['Remove infected lower leaves immediately', 'Apply neem oil or copper fungicide', 'Mulch around plants to prevent soil splash'],
    chemical: ['Chlorothalonil every 7-10 days', 'Azoxystrobin — strobilurin fungicide', 'Mancozeb — protective'],
    prevention: ['Stake plants for air circulation', 'Water at base not overhead', 'Rotate crops every 3 years', 'Remove plant debris after harvest'],
  },
  'Potato Late Blight': {
    desc: 'Most devastating potato disease caused by Phytophthora infestans. Creates dark water-soaked lesions with white mold on leaf undersides. Tubers rot in storage.',
    spread: 'Spreads through airborne spores in cool wet weather. Infected seed potatoes are primary source. Can spread from nearby tomato plants.',
    organic: ['Remove and destroy infected plants immediately', 'Apply copper-based fungicide preventively', 'Avoid working in fields when wet'],
    chemical: ['Metalaxyl-M (Ridomil Gold)', 'Cymoxanil + mancozeb', 'Dimethomorph — systemic'],
    prevention: ['Use certified disease-free seed potatoes', 'Hill soil to protect tubers', 'Avoid overhead irrigation', 'Destroy volunteer potato plants'],
  },
  'Potato Early Blight': {
    desc: 'Caused by Alternaria solani. Creates dark brown spots with concentric rings on older leaves, reducing photosynthesis and weakening plants before harvest.',
    spread: 'Spreads through spores from infected debris. Warm humid weather and stressed plants are most susceptible. Spreads by wind, rain, and contaminated tools.',
    organic: ['Remove infected leaves', 'Apply copper fungicide', 'Ensure adequate plant nutrition to reduce stress'],
    chemical: ['Chlorothalonil', 'Mancozeb', 'Azoxystrobin'],
    prevention: ['Rotate crops', 'Maintain proper plant nutrition', 'Avoid overhead irrigation', 'Use certified seed potatoes'],
  },
  'Corn Gray Leaf Spot': {
    desc: 'Caused by Cercospora zeae-maydis. Produces rectangular gray-tan lesions parallel to leaf veins, reducing photosynthesis and yield significantly.',
    spread: 'Spreads through spores from infected crop residue. High humidity, warm nights, and heavy dew favor development. Minimum tillage increases risk.',
    organic: ['Rotate crops away from corn for 1-2 years', 'Till infected residue to speed decomposition', 'Improve field drainage'],
    chemical: ['Azoxystrobin (Quadris)', 'Propiconazole (Tilt)', 'Pyraclostrobin + metconazole'],
    prevention: ['Plant resistant hybrids', 'Rotate crops annually', 'Manage crop residue', 'Wider row spacing for air circulation'],
  },
  'Corn Common Rust': {
    desc: 'Caused by Puccinia sorghi. Creates small, oval, brick-red pustules on both leaf surfaces. Severe infections reduce photosynthesis and yield.',
    spread: 'Spreads through airborne urediniospores. Cool temperatures (60-77°F) and high humidity favor infection. Spores can travel long distances by wind.',
    organic: ['Apply sulfur-based fungicide at first sign', 'Remove heavily infected leaves', 'Improve air circulation'],
    chemical: ['Azoxystrobin', 'Propiconazole', 'Trifloxystrobin'],
    prevention: ['Plant resistant hybrids', 'Early planting to avoid peak rust season', 'Monitor fields regularly', 'Apply preventive fungicides in high-risk areas'],
  },
  'Grape Black Rot': {
    desc: 'Caused by Guignardia bidwellii. Creates circular brown lesions on leaves and turns berries into hard black shriveled mummies that remain on the vine.',
    spread: 'Spreads through spores from mummified berries and infected canes. Warm wet weather (65-85°F) during bloom is the critical infection period.',
    organic: ['Remove all mummified berries from vine and ground', 'Apply copper fungicide from bud break', 'Improve canopy air circulation by pruning'],
    chemical: ['Myclobutanil (Rally)', 'Mancozeb — protective', 'Tebuconazole — systemic'],
    prevention: ['Remove mummified berries before spring', 'Prune for open canopy', 'Apply fungicides from bud break through veraison', 'Avoid wetting foliage'],
  },
  'Tomato Bacterial Spot': {
    desc: 'Caused by Xanthomonas species bacteria. Creates small dark water-soaked spots on leaves, stems, and fruit. Severely reduces fruit quality and marketability.',
    spread: 'Spreads through infected seed, transplants, and rain splash. Warm wet weather (75-86°F) favors rapid spread. Spreads easily during transplanting.',
    organic: ['Apply copper bactericide every 5-7 days', 'Remove severely infected plants', 'Avoid working in wet fields'],
    chemical: ['Copper hydroxide + mancozeb', 'Streptomycin (limited use)', 'Fixed copper bactericides'],
    prevention: ['Use certified disease-free seed', 'Avoid overhead irrigation', 'Rotate crops for 2-3 years', 'Disinfect tools between plants'],
  },
  'Tomato Leaf Mold': {
    desc: 'Caused by Passalora fulva. Creates pale green to yellow spots on upper leaf surfaces with olive-green to grayish-purple mold on undersides.',
    spread: 'Spreads through airborne spores in high humidity (85%+). Common in greenhouses and tunnels. Spores survive on plant debris and in soil.',
    organic: ['Improve ventilation in greenhouses', 'Remove infected leaves', 'Apply copper-based fungicide'],
    chemical: ['Chlorothalonil', 'Mancozeb', 'Azoxystrobin'],
    prevention: ['Maintain humidity below 85%', 'Improve air circulation', 'Use resistant varieties', 'Avoid overhead irrigation'],
  },
  'Healthy': {
    desc: 'Your plant appears healthy with no visible signs of disease. The leaves show normal coloration, texture, and structure. Continue your current care routine.',
    spread: 'No disease detected. Your plant is in excellent condition.',
    organic: ['Continue regular weekly monitoring', 'Maintain proper watering schedule', 'Apply compost for soil health'],
    chemical: ['No treatment needed', 'Consider preventive copper spray during high-risk periods'],
    prevention: ['Maintain proper plant spacing for air circulation', 'Water at the base of plants', 'Monitor regularly for early signs', 'Practice crop rotation annually'],
  },

  // ── Rice ──────────────────────────────────────────────────────────────────
  'Rice Blast': {
    desc: 'Caused by Magnaporthe oryzae — the most economically important rice disease worldwide. Creates diamond-shaped lesions with gray centers and brown borders on leaves. Neck blast causes complete panicle death.',
    spread: 'Spreads through airborne spores in high humidity (>90%) and temperatures of 77-82°F. Excess nitrogen fertilization greatly increases susceptibility.',
    organic: ['Remove and destroy infected plant debris', 'Apply silicon fertilizer to strengthen cell walls', 'Use blast-resistant varieties (IR64, Swarna, IRRI varieties)'],
    chemical: ['Tricyclazole — most effective systemic fungicide', 'Isoprothiolane — systemic with good efficacy', 'Propiconazole — broad spectrum triazole'],
    prevention: ['Plant blast-resistant varieties', 'Avoid excess nitrogen fertilization', 'Maintain proper water management', 'Apply silicon fertilizer', 'Protect at booting stage to prevent neck blast'],
  },
  'Rice Brown Spot': {
    desc: 'Caused by Cochliobolus miyabeanus. Creates oval brown lesions with yellow halos on leaves. Strongly linked to nutrient deficiency, especially potassium and silicon.',
    spread: 'Spreads through infected seeds and airborne spores. Nutrient-deficient plants are most susceptible. Warm humid conditions favor spread.',
    organic: ['Improve soil fertility with balanced NPK', 'Apply silicon fertilizer', 'Use healthy certified seeds'],
    chemical: ['Mancozeb — protective fungicide', 'Iprodione — systemic', 'Propiconazole — broad spectrum'],
    prevention: ['Use certified disease-free seeds', 'Maintain balanced soil nutrition', 'Treat seeds with fungicide before planting', 'Avoid water stress'],
  },
  'Rice Bacterial Leaf Blight': {
    desc: 'Caused by Xanthomonas oryzae pv. oryzae. Creates water-soaked lesions that turn yellow then white along leaf margins. One of the most serious bacterial diseases of rice.',
    spread: 'Spreads through infected water, rain splash, and wind. Enters through wounds and natural openings. Flooding and high nitrogen favor spread.',
    organic: ['Drain fields during early infection', 'Remove infected plant debris', 'Use resistant varieties'],
    chemical: ['No highly effective chemical cure', 'Copper bactericides may reduce spread', 'Streptomycin (limited use)'],
    prevention: ['Use resistant varieties', 'Avoid excess nitrogen', 'Improve field drainage', 'Use certified disease-free seeds', 'Remove infected debris after harvest'],
  },
  'Rice Sheath Blight': {
    desc: 'Caused by Rhizoctonia solani. Creates oval lesions on leaf sheaths with gray-white centers and brown borders. Causes lodging and significant yield loss in dense plantings.',
    spread: 'Spreads through sclerotia in soil and water. High plant density, excess nitrogen, and flooding favor rapid spread.',
    organic: ['Reduce plant density', 'Drain fields periodically', 'Remove infected plant material'],
    chemical: ['Validamycin — most effective', 'Hexaconazole — systemic triazole', 'Propiconazole — broad spectrum'],
    prevention: ['Reduce plant density', 'Avoid excess nitrogen', 'Drain fields periodically', 'Use resistant varieties', 'Rotate crops'],
  },

  // ── Sugarcane ─────────────────────────────────────────────────────────────
  'Sugarcane Red Rot': {
    desc: 'Caused by Colletotrichum falcatum — the most serious disease of sugarcane. Creates red discoloration inside the stalk with white patches and a sour smell. Can destroy entire crops.',
    spread: 'Spreads through infected setts (planting material), waterlogging, and contaminated soil. Spreads rapidly in wet conditions.',
    organic: ['Hot water treatment of setts at 50°C for 2 hours', 'Remove and destroy infected clumps immediately', 'Improve field drainage'],
    chemical: ['Carbendazim (0.1%) sett treatment before planting', 'Thiophanate-methyl fungicide', 'Copper oxychloride spray'],
    prevention: ['Use disease-free setts from certified nurseries', 'Plant resistant varieties (Co 86032, CoJ 64)', 'Avoid waterlogging', 'Crop rotation every 3-4 years', 'Disinfect cutting tools'],
  },
  'Sugarcane Smut': {
    desc: 'Caused by Sporisorium scitamineum. Produces black whip-like structures replacing the growing shoot. Severely reduces yield and sucrose content.',
    spread: 'Spreads through airborne spores from infected plants. Spreads through infected setts. Warm dry conditions favor spread.',
    organic: ['Rogue out and destroy infected plants immediately', 'Hot water treatment of setts', 'Remove infected plants before spores mature'],
    chemical: ['Propiconazole sett treatment', 'Triadimefon fungicide', 'Carbendazim treatment'],
    prevention: ['Use hot water treated setts', 'Plant resistant varieties', 'Avoid ratoon crops from infected fields', 'Regular field monitoring'],
  },

  // ── Wheat ─────────────────────────────────────────────────────────────────
  'Wheat Yellow Rust': {
    desc: 'Caused by Puccinia striiformis — one of the most destructive wheat diseases. Creates yellow-orange pustules in stripes along leaf veins. Can cause 70%+ yield loss in susceptible varieties.',
    spread: 'Spreads through airborne urediniospores over long distances. Cool temperatures (50-59°F) and high humidity favor infection. Can spread across continents.',
    organic: ['Remove infected plant material', 'Apply sulfur-based fungicide', 'Use resistant varieties immediately'],
    chemical: ['Tebuconazole — most effective triazole', 'Propiconazole — systemic', 'Azoxystrobin + propiconazole combination'],
    prevention: ['Plant resistant varieties', 'Monitor fields regularly from tillering', 'Apply preventive fungicides in high-risk areas', 'Early planting to avoid peak rust season'],
  },
  'Wheat Brown Rust': {
    desc: 'Caused by Puccinia triticina (leaf rust). Creates small round orange-brown pustules on upper leaf surfaces. Very common and widespread wheat disease.',
    spread: 'Spreads through airborne spores. Warm temperatures (59-77°F) and high humidity favor infection. Can spread rapidly across fields.',
    organic: ['Apply sulfur fungicide at first sign', 'Remove heavily infected leaves', 'Use resistant varieties'],
    chemical: ['Triazole fungicides (tebuconazole, propiconazole)', 'Strobilurin fungicides (azoxystrobin)', 'Combination products'],
    prevention: ['Plant resistant varieties', 'Early planting', 'Monitor from tillering stage', 'Apply preventive fungicides in high-risk seasons'],
  },
  'Wheat Fusarium Head Blight': {
    desc: 'Caused by Fusarium graminearum. Creates pink/salmon mold on wheat heads. Produces dangerous mycotoxins (deoxynivalenol/DON) that contaminate grain and are harmful to humans and animals.',
    spread: 'Spreads through airborne spores during flowering. Warm wet weather during flowering is critical infection period. Corn-wheat rotation increases risk.',
    organic: ['Remove infected heads', 'Harvest promptly when mature', 'Improve field drainage'],
    chemical: ['Tebuconazole at flowering — most effective', 'Metconazole — systemic', 'Prothioconazole — excellent efficacy'],
    prevention: ['Apply fungicide at flowering stage', 'Use resistant varieties', 'Avoid corn-wheat rotation', 'Harvest promptly', 'Test grain for mycotoxins before use'],
  },

  // ── Banana ────────────────────────────────────────────────────────────────
  'Banana Panama Disease': {
    desc: 'Caused by Fusarium oxysporum f.sp. cubense — the most devastating banana disease. Causes yellowing, wilting, and death of plants. No chemical cure exists. Destroyed the Gros Michel variety globally.',
    spread: 'Spreads through infected soil, water, and planting material. Survives in soil for decades. Spreads through contaminated tools and footwear.',
    organic: ['Remove and destroy infected plants immediately', 'Do not replant susceptible varieties in infected soil', 'Improve drainage', 'Use biological control agents (Trichoderma)'],
    chemical: ['No effective chemical cure', 'Soil fumigation may reduce inoculum', 'Preventive biological treatments'],
    prevention: ['Use disease-free tissue culture planting material', 'Plant resistant varieties (Cavendish, FHIA hybrids)', 'Disinfect tools and footwear', 'Avoid moving soil from infected areas', 'Improve drainage'],
  },
  'Banana Black Sigatoka': {
    desc: 'Caused by Mycosphaerella fijiensis. Creates black streaks on leaves that expand into large necrotic areas. Reduces photosynthesis by up to 50%, severely reducing yield and fruit quality.',
    spread: 'Spreads through airborne spores in humid conditions. Requires 12+ hours of leaf wetness for infection. Can spread rapidly in plantations.',
    organic: ['Remove infected leaves regularly', 'Improve drainage and air circulation', 'Apply copper-based fungicides'],
    chemical: ['Propiconazole — systemic triazole', 'Mancozeb — protective', 'Trifloxystrobin — strobilurin', 'Rotate fungicide classes to prevent resistance'],
    prevention: ['Use resistant varieties', 'Remove infected leaves', 'Improve drainage', 'Maintain proper plant spacing', 'Regular fungicide program'],
  },

  // ── Mango ─────────────────────────────────────────────────────────────────
  'Mango Anthracnose': {
    desc: 'Caused by Colletotrichum gloeosporioides — the most common mango disease. Creates black spots on leaves, flowers, and fruit. Causes significant post-harvest losses.',
    spread: 'Spreads through spores in wet conditions. Infects flowers and young fruit during wet weather. Post-harvest spread in storage.',
    organic: ['Apply copper fungicide at flowering', 'Bag fruits to prevent infection', 'Improve air circulation by pruning'],
    chemical: ['Copper hydroxide + mancozeb at flowering', 'Azoxystrobin — systemic', 'Propiconazole — triazole', 'Post-harvest hot water treatment (52°C for 5 min)'],
    prevention: ['Apply fungicides from flowering through fruit development', 'Prune for open canopy', 'Bag fruits', 'Avoid wetting foliage', 'Post-harvest treatment'],
  },
  'Mango Powdery Mildew': {
    desc: 'Caused by Oidium mangiferae. Creates white powdery coating on young leaves, flowers, and fruit. Severely reduces fruit set and yield during flowering season.',
    spread: 'Spreads through airborne spores. Warm days and cool nights with low humidity favor infection. Most severe during flowering.',
    organic: ['Apply wettable sulfur at flower emergence', 'Neem oil spray', 'Improve air circulation'],
    chemical: ['Sulfur fungicides — very effective', 'Hexaconazole — systemic', 'Myclobutanil — triazole', 'Tebuconazole'],
    prevention: ['Apply preventive fungicides at flower emergence', 'Prune for open canopy', 'Avoid excess nitrogen', 'Monitor during flowering season'],
  },

  // ── Coffee ────────────────────────────────────────────────────────────────
  'Coffee Leaf Rust': {
    desc: 'Caused by Hemileia vastatrix — the most important coffee disease worldwide. Creates orange-yellow powdery pustules on leaf undersides. Destroyed the Sri Lanka coffee industry in the 1870s.',
    spread: 'Spreads through airborne spores in humid conditions. Rain splash and wind spread spores. Warm temperatures (59-77°F) and high humidity favor infection.',
    organic: ['Apply copper fungicides preventively', 'Improve shade management', 'Maintain proper plant nutrition'],
    chemical: ['Copper hydroxide — protective', 'Tebuconazole — systemic triazole', 'Trifloxystrobin — strobilurin', 'Propiconazole'],
    prevention: ['Use resistant varieties (Catimor, Sarchimor, Ruiru 11)', 'Maintain proper shade', 'Apply preventive copper fungicides', 'Prune for air circulation', 'Balanced fertilization'],
  },
}

export function getDiseaseInfo(name) {
  if (!name) return DISEASE_DB['Healthy']
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(DISEASE_DB)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower.split(' ')[0])) return val
  }
  return {
    desc: `${name} is a plant disease affecting crop health and yield. Timely treatment is essential for effective management.`,
    spread: 'Spreads through spores, infected plant material, insects, or contaminated soil and water. Warm humid conditions accelerate spread.',
    organic: ['Remove and destroy infected plant parts', 'Apply neem oil or copper-based fungicide', 'Improve air circulation around plants'],
    chemical: ['Consult local agricultural extension for recommendations', 'Apply broad-spectrum fungicide as directed', 'Follow all safety instructions carefully'],
    prevention: ['Practice crop rotation every 2-3 years', 'Use disease-resistant varieties', 'Maintain proper plant spacing', 'Avoid overhead irrigation'],
  }
}

// icon names (strings) — mapped to actual components in Diagnosis.jsx
export const SEV_CONFIG = {
  none:    { label: 'Healthy',  color: '#00FF87', bg: 'rgba(0,255,135,0.1)',   border: 'rgba(0,255,135,0.35)',   iconName: 'CheckCircle'   },
  moderate:{ label: 'Moderate', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.35)',  iconName: 'AlertTriangle' },
  high:    { label: 'High',     color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.35)',  iconName: 'AlertTriangle' },
  severe:  { label: 'Severe',   color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.35)', iconName: 'XCircle'       },
  unknown: { label: 'Unknown',  color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.35)', iconName: 'Info'          },
}

export function getSeverityKey(result) {
  if (!result) return 'unknown'
  if (result.is_healthy) return 'none'
  const n = result.disease_name?.toLowerCase() || ''
  // Severe diseases
  if (
    n.includes('late blight') ||
    n.includes('virus') ||
    n.includes('greening') ||
    n.includes('esca') ||
    n.includes('panama disease') ||
    n.includes('fusarium wilt') ||
    n.includes('bunchy top') ||
    n.includes('yellow rust') ||
    n.includes('stripe rust') ||
    n.includes('fusarium head blight') ||
    n.includes('berry disease') ||
    n.includes('red rot') ||
    n.includes('blast')
  ) return 'severe'
  // High severity
  if (
    n.includes('blight') ||
    n.includes('rot') ||
    n.includes('rust') ||
    n.includes('sigatoka') ||
    n.includes('smut') ||
    n.includes('wilt') ||
    n.includes('canker') ||
    n.includes('anthracnose') ||
    n.includes('bacterial leaf blight') ||
    n.includes('sheath blight')
  ) return 'high'
  return 'moderate'
}
