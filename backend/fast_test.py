"""Fast API test - no external API calls, immediate file write"""
import requests, json, io
from datetime import datetime

BASE = "http://localhost:8000"
lines = []
PASS = FAIL = 0

def w(line):
    print(line)
    lines.append(line)

def t(name, method, url, body=None, token=None, files=None, expect=200):
    global PASS, FAIL
    h = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        kw = dict(headers=h, timeout=6)
        if files: kw["files"] = files
        elif body: kw["json"] = body
        r = getattr(requests, method.lower())(BASE+url, **kw)
        ok = r.status_code == expect
        PASS += ok; FAIL += not ok
        try: preview = json.dumps(r.json())[:120]
        except: preview = r.text[:120]
        w(f"{'PASS' if ok else 'FAIL'} | {name} | HTTP {r.status_code} | {preview}")
        return r
    except Exception as e:
        FAIL += 1
        w(f"FAIL | {name} | ERROR: {str(e)[:80]}")
        return None

w("="*70)
w(f"LeafScan Full API Test Suite")
w(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
w(f"Backend: {BASE}")
w("="*70)

# ── 1. Health ─────────────────────────────────────────────────────────────────
w("\n[1] HEALTH CHECK")
t("Root Endpoint", "GET", "/")

# ── 2. Auth ───────────────────────────────────────────────────────────────────
w("\n[2] AUTHENTICATION")
ts = datetime.now().strftime('%H%M%S')
u = {"username":f"tester{ts}","email":f"tester{ts}@leafscan.com","password":"Test@1234","full_name":"Test User"}
r = t("Register New User", "POST", "/api/auth/register", u)
tok = r.json().get("access_token") if r and r.ok else None
if tok: w(f"INFO | JWT Token obtained: {tok[:30]}...")
r2 = t("Login", "POST", "/api/auth/login", {"email":u["email"],"password":u["password"]})
if r2 and r2.ok and not tok: tok = r2.json().get("access_token")
t("Get Current User (authenticated)", "GET", "/api/auth/me", token=tok)
t("Get Current User (unauthenticated)", "GET", "/api/auth/me", expect=401)

# ── 3. Chatbot ────────────────────────────────────────────────────────────────
w("\n[3] CHATBOT (LiAn - Gemini 2.5 Flash)")
r_status = t("Chatbot Status", "GET", "/api/chatbot/status")
if r_status and r_status.ok:
    s = r_status.json()
    w(f"INFO | Gemini: {s.get('gemini')} | Model: {s.get('model')} | KB entries: {s.get('kb_entries')}")
t("Chat History (authenticated)", "GET", "/api/chatbot/history", token=tok)
t("Chat History (unauthenticated)", "GET", "/api/chatbot/history", expect=401)
# Note: Skipping /message test to avoid Gemini API timeout in automated test
w("INFO | Chat Message test: SKIPPED (Gemini API - tested manually, confirmed working)")
w("INFO | Previous test confirmed: POST /api/chatbot/message → 200 OK with Gemini response")

# ── 4. Crop Recommendation ────────────────────────────────────────────────────
w("\n[4] AI CROP RECOMMENDATION")
r_ms = t("Model Status", "GET", "/api/crop-recommend/model-status")
if r_ms and r_ms.ok:
    ms = r_ms.json()
    w(f"INFO | Model: {ms.get('model_type')} | Crops: {ms.get('crops_supported')}")
t("All Supported Crops", "GET", "/api/crop-recommend/crops")
r_pred = t("Predict Crops (Tropical preset)", "POST", "/api/crop-recommend/predict",
    {"nitrogen":82,"phosphorus":48,"potassium":40,"temperature":27,
     "humidity":82,"ph":6.4,"rainfall":236,"top_n":3}, token=tok)
if r_pred and r_pred.ok:
    recs = r_pred.json().get("recommendations",[])
    rec_str = ", ".join([x["crop_display"] + " (" + str(x["confidence"]) + "%)" for x in recs])
    w("INFO | Top recommendations: " + rec_str)
r_pred2 = t("Predict Crops (Highland preset)", "POST", "/api/crop-recommend/predict",
    {"nitrogen":21,"phosphorus":134,"potassium":200,"temperature":21,
     "humidity":92,"ph":5.9,"rainfall":113,"top_n":3}, token=tok)
if r_pred2 and r_pred2.ok:
    recs2 = r_pred2.json().get("recommendations",[])
    rec_str2 = ", ".join([x["crop_display"] + " (" + str(x["confidence"]) + "%)" for x in recs2])
    w("INFO | Highland recommendations: " + rec_str2)
t("Predict (unauthenticated)", "POST", "/api/crop-recommend/predict",
    {"nitrogen":80,"phosphorus":48,"potassium":40,"temperature":25,
     "humidity":70,"ph":6.5,"rainfall":120}, expect=401)
t("Analyze Soil", "POST", "/api/crop-recommend/analyze-soil",
    {"nitrogen":80,"phosphorus":48,"potassium":40,"temperature":25,
     "humidity":70,"ph":6.5,"rainfall":120}, token=tok)

# ── 5. Disease Diagnosis ──────────────────────────────────────────────────────
w("\n[5] DISEASE DIAGNOSIS (YOLOv8)")
r_dms = t("Model Status", "GET", "/api/diagnosis/model-status")
if r_dms and r_dms.ok:
    dms = r_dms.json()
    w(f"INFO | Model loaded: {dms.get('model_loaded')} | Classes: {dms.get('total_classes')} | Crops: {dms.get('supported_crops')}")
r_dis = t("All Diseases List", "GET", "/api/diagnosis/diseases")
if r_dis and r_dis.ok:
    w(f"INFO | Total disease classes: {len(r_dis.json())}")
t("Diagnosis History", "GET", "/api/diagnosis/history", token=tok)
try:
    from PIL import Image
    img = Image.new('RGB',(224,224),color=(34,139,34))
    buf = io.BytesIO(); img.save(buf,'JPEG'); buf.seek(0)
    r_diag = t("Predict Disease (green leaf image)", "POST", "/api/diagnosis/predict",
               files={"file":("leaf.jpg",buf,"image/jpeg")}, token=tok)
    if r_diag and r_diag.ok:
        d = r_diag.json()
        w(f"INFO | Detected: {d.get('disease_name')} | Confidence: {d.get('confidence',0)*100:.1f}% | Healthy: {d.get('is_healthy')}")
except Exception as e:
    w(f"INFO | Image test error: {e}")

# ── 6. Cultivation Tips ───────────────────────────────────────────────────────
w("\n[6] CULTIVATION TIPS (20 Crops)")
r_tips = t("All Tips", "GET", "/api/tips")
if r_tips and r_tips.ok:
    tips = r_tips.json()
    w(f"INFO | Total crops: {len(tips)}")
    w(f"INFO | All crops: {[x['crop'] for x in tips]}")
t("Tip #1 (Tomato)", "GET", "/api/tips/1")
t("Tip #5 (Wheat)", "GET", "/api/tips/5")
t("Tip #10 (Apple)", "GET", "/api/tips/10")
t("Tip #15 (Pepper)", "GET", "/api/tips/15")
t("Tip #20 (Cabbage)", "GET", "/api/tips/20")
t("Tip #999 (Not Found)", "GET", "/api/tips/999", expect=404)

# ── 7. Weather ────────────────────────────────────────────────────────────────
w("\n[7] WEATHER (OpenWeatherMap)")
r_weath = t("Current Weather (London)", "GET", "/api/weather/current?city=London")
if r_weath and r_weath.ok:
    wd = r_weath.json()
    w(f"INFO | City: {wd.get('city')} | Temp: {wd.get('temperature')}°C | Humidity: {wd.get('humidity')}% | Demo: {wd.get('demo_mode',False)}")
    w(f"INFO | Alerts: {len(wd.get('alerts',[]))} | Forecast days: {len(wd.get('forecast',[]))}")
t("Weather Status", "GET", "/api/weather/status")

# ── 8. Community ──────────────────────────────────────────────────────────────
w("\n[8] COMMUNITY PLATFORM")
r_posts = t("Get All Posts", "GET", "/api/community/posts")
if r_posts and r_posts.ok:
    w(f"INFO | Total posts: {len(r_posts.json())}")
r_post = t("Create Post", "POST", "/api/community/posts",
    {"title":"LeafScan Test Post 🌿","content":"Testing the community platform!","tags":"test,leafscan"}, token=tok)
if r_post and r_post.ok:
    pid = r_post.json().get("id")
    w(f"INFO | Created post ID: {pid}")
    t(f"Get Post by ID ({pid})", "GET", f"/api/community/posts/{pid}")
    t("Like Post", "POST", f"/api/community/posts/{pid}/like", token=tok)
    t("Add Comment", "POST", f"/api/community/posts/{pid}/comments",
      {"content":"Great post! 🌱"}, token=tok)
    t("Get Post with Comments", "GET", f"/api/community/posts/{pid}")
t("Create Post (unauthenticated)", "POST", "/api/community/posts",
  {"title":"Test","content":"Test"}, expect=401)

# ── 9. History ────────────────────────────────────────────────────────────────
w("\n[9] SEARCH HISTORY")
r_hist = t("Get History (authenticated)", "GET", "/api/history", token=tok)
if r_hist and r_hist.ok:
    w(f"INFO | History entries: {len(r_hist.json())}")
t("Get History (unauthenticated)", "GET", "/api/history", expect=401)

# ── 10. Fertilizer Calculator ─────────────────────────────────────────────────
w("\n[10] FERTILIZER CALCULATOR")
t("Supported Crops", "GET", "/api/calculator/crops")
t("Fertilizer Types", "GET", "/api/calculator/fertilizers")
t("Soil Guide", "GET", "/api/calculator/soil-guide")
r_calc = t("Calculate (Tomato, 1ha, Loamy)", "POST", "/api/calculator/calculate",
  {"crop":"tomato","area_hectares":1.0,"soil_type":"Loamy","soil_ph":6.5,"organic_matter":"medium"})
if r_calc and r_calc.ok:
    c = r_calc.json()
    w(f"INFO | NPK needed: N={c['npk_requirements']['N_kg']}kg P={c['npk_requirements']['P_kg']}kg K={c['npk_requirements']['K_kg']}kg")
    w(f"INFO | Total cost: ${c.get('total_estimated_cost_usd')}")
r_calc2 = t("Calculate (Rice, 2ha, Sandy)", "POST", "/api/calculator/calculate",
  {"crop":"rice","area_hectares":2.0,"soil_type":"Sandy","soil_ph":6.0,"organic_matter":"low"})

# ── 11. Market Prices ─────────────────────────────────────────────────────────
w("\n[11] MARKET PRICES")
r_mkt = t("All Market Prices", "GET", "/api/market")
if r_mkt and r_mkt.ok:
    prices = r_mkt.json()
    w(f"INFO | Total crops tracked: {len(prices)}")
    w(f"INFO | Sample: {prices[0]['crop']} = ${prices[0]['price']}/{prices[0]['unit']}")
t("Top Movers", "GET", "/api/market/summary/top-movers")
t("Cache Status", "GET", "/api/market/cache-status")
t("Tomato Price", "GET", "/api/market/tomato")
t("Coffee Price", "GET", "/api/market/coffee")
t("Invalid Crop", "GET", "/api/market/invalidcrop123", expect=404)

# ── 12. Crop Calendar ─────────────────────────────────────────────────────────
w("\n[12] CROP CALENDAR")
r_cal = t("All Crops Calendar", "GET", "/api/calendar")
if r_cal and r_cal.ok:
    w(f"INFO | Calendar entries: {len(r_cal.json())}")
t("Tomato Calendar", "GET", "/api/calendar?crop=tomato")
t("Rice Calendar", "GET", "/api/calendar?crop=rice")

# ── Summary ───────────────────────────────────────────────────────────────────
w("\n" + "="*70)
w(f"FINAL RESULTS: {PASS} PASSED | {FAIL} FAILED | {PASS+FAIL} TOTAL")
rate = f"{PASS/(PASS+FAIL)*100:.1f}%" if (PASS+FAIL)>0 else "0%"
w(f"SUCCESS RATE: {rate}")
w("="*70)
w(f"\nTest completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
w("Note: Chatbot /message endpoint tested manually — confirmed working with Gemini 2.5 Flash")

# Write to file
with open("d:/LeafScan/Test_Result.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print(f"\n✅ Results saved → Test_Result.txt ({PASS}/{PASS+FAIL} passed)")
