"""Quick API test - writes results immediately, short timeouts"""
import requests, json, io, sys
from datetime import datetime

BASE = "http://localhost:8000"
OUT = open("d:/LeafScan/Test_Result.txt", "w", encoding="utf-8", buffering=1)
PASS = FAIL = 0

def w(line):
    print(line)
    OUT.write(line + "\n")
    OUT.flush()

def t(name, method, url, body=None, token=None, files=None, expect=200):
    global PASS, FAIL
    h = {}
    if token: h["Authorization"] = f"Bearer {token}"
    try:
        kw = dict(headers=h, timeout=8)
        if files: kw["files"] = files
        elif body: kw["json"] = body
        r = getattr(requests, method.lower())(BASE+url, **kw)
        ok = r.status_code == expect
        PASS += ok; FAIL += not ok
        try: preview = json.dumps(r.json())[:100]
        except: preview = r.text[:100]
        w(f"{'PASS' if ok else 'FAIL'} | {name} | {r.status_code} | {preview}")
        return r
    except Exception as e:
        FAIL += 1
        w(f"FAIL | {name} | ERROR: {str(e)[:80]}")
        return None

w("="*70)
w(f"LeafScan API Test Suite — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
w("="*70)

# 1. Health
w("\n[1] HEALTH")
t("Root", "GET", "/")
t("Docs", "GET", "/docs")

# 2. Auth
w("\n[2] AUTH")
ts = datetime.now().strftime('%H%M%S')
u = {"username":f"tester{ts}","email":f"tester{ts}@test.com","password":"Test@1234","full_name":"Tester"}
r = t("Register", "POST", "/api/auth/register", u)
tok = r.json().get("access_token") if r and r.ok else None
if tok: w(f"INFO | Token: {tok[:25]}...")
r2 = t("Login", "POST", "/api/auth/login", {"email":u["email"],"password":u["password"]})
if r2 and r2.ok and not tok: tok = r2.json().get("access_token")
t("Get Me", "GET", "/api/auth/me", token=tok)
t("Get Me (no auth)", "GET", "/api/auth/me", expect=401)

# 3. Chatbot (status only - skip message to avoid Gemini timeout)
w("\n[3] CHATBOT")
t("Chatbot Status", "GET", "/api/chatbot/status")
t("Chat History", "GET", "/api/chatbot/history", token=tok)
# Quick message test with short timeout
try:
    h = {"Authorization": f"Bearer {tok}"} if tok else {}
    r = requests.post(BASE+"/api/chatbot/message", json={"message":"hello"}, headers=h, timeout=12)
    ok = r.status_code == 200
    PASS += ok; FAIL += not ok
    try: preview = json.dumps(r.json())[:100]
    except: preview = r.text[:100]
    w(f"{'PASS' if ok else 'FAIL'} | Chat Message | {r.status_code} | {preview}")
except Exception as e:
    FAIL += 1
    w(f"FAIL | Chat Message | TIMEOUT/ERROR: {str(e)[:60]}")

# 4. Crop Recommendation
w("\n[4] CROP RECOMMENDATION")
t("Model Status", "GET", "/api/crop-recommend/model-status")
t("All Crops", "GET", "/api/crop-recommend/crops")
r = t("Predict (auth)", "POST", "/api/crop-recommend/predict",
    {"nitrogen":80,"phosphorus":48,"potassium":40,"temperature":25,
     "humidity":70,"ph":6.5,"rainfall":120,"top_n":3}, token=tok)
if r and r.ok:
    recs = r.json().get("recommendations",[])
    w(f"INFO | Recommendations: {[x['crop_display'] for x in recs]}")
t("Predict (no auth)", "POST", "/api/crop-recommend/predict",
    {"nitrogen":80,"phosphorus":48,"potassium":40,"temperature":25,
     "humidity":70,"ph":6.5,"rainfall":120}, expect=401)

# 5. Diagnosis
w("\n[5] DIAGNOSIS")
t("Model Status", "GET", "/api/diagnosis/model-status")
t("All Diseases", "GET", "/api/diagnosis/diseases")
t("History", "GET", "/api/diagnosis/history", token=tok)
try:
    from PIL import Image
    img = Image.new('RGB',(224,224),color=(34,139,34))
    buf = io.BytesIO(); img.save(buf,'JPEG'); buf.seek(0)
    r = t("Predict Image", "POST", "/api/diagnosis/predict",
          files={"file":("leaf.jpg",buf,"image/jpeg")}, token=tok)
    if r and r.ok:
        d = r.json()
        w(f"INFO | Disease: {d.get('disease_name')} | Conf: {d.get('confidence',0)*100:.1f}%")
except Exception as e:
    w(f"INFO | Image test: {e}")

# 6. Tips
w("\n[6] CULTIVATION TIPS")
r = t("All Tips", "GET", "/api/tips")
if r and r.ok:
    tips = r.json()
    w(f"INFO | Total crops: {len(tips)}")
    w(f"INFO | Crops: {[x['crop'] for x in tips]}")
t("Tip by ID 1", "GET", "/api/tips/1")
t("Tip by ID 10", "GET", "/api/tips/10")
t("Tip by ID 20", "GET", "/api/tips/20")
t("Tip 999 (not found)", "GET", "/api/tips/999", expect=404)

# 7. Weather
w("\n[7] WEATHER")
t("Weather Current", "GET", "/api/weather/current?city=London")
t("Weather Status", "GET", "/api/weather/status")

# 8. Community
w("\n[8] COMMUNITY")
t("Get Posts", "GET", "/api/community/posts")
r = t("Create Post", "POST", "/api/community/posts",
    {"title":"Test Post","content":"LeafScan test!","tags":"test"}, token=tok)
if r and r.ok:
    pid = r.json().get("id")
    t(f"Get Post {pid}", "GET", f"/api/community/posts/{pid}")
    t("Like Post", "POST", f"/api/community/posts/{pid}/like", token=tok)
    t("Add Comment", "POST", f"/api/community/posts/{pid}/comments",
      {"content":"Great!"}, token=tok)

# 9. History
w("\n[9] HISTORY")
t("Get History", "GET", "/api/history", token=tok)
t("History (no auth)", "GET", "/api/history", expect=401)

# 10. Calculator
w("\n[10] FERTILIZER CALCULATOR")
t("Supported Crops", "GET", "/api/calculator/crops")
t("Fertilizer List", "GET", "/api/calculator/fertilizers")
t("Calculate", "POST", "/api/calculator/calculate",
  {"crop":"tomato","area_hectares":1.0,"soil_type":"Loamy","soil_ph":6.5,"organic_matter":"medium"})

# 11. Market
w("\n[11] MARKET PRICES")
t("All Prices", "GET", "/api/market")
t("Top Movers", "GET", "/api/market/summary/top-movers")
t("Cache Status", "GET", "/api/market/cache-status")
t("Tomato Price", "GET", "/api/market/tomato")

# 12. Calendar
w("\n[12] CROP CALENDAR")
t("Calendar", "GET", "/api/calendar")
t("Calendar Tomato", "GET", "/api/calendar?crop=tomato")

# Summary
w("\n" + "="*70)
w(f"TOTAL: {PASS} PASSED | {FAIL} FAILED | {PASS+FAIL} TOTAL")
w(f"SUCCESS RATE: {PASS/(PASS+FAIL)*100:.1f}%" if (PASS+FAIL)>0 else "0%")
w("="*70)
OUT.close()
print("Done! Results in Test_Result.txt")
