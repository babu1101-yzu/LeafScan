"""
LeafScan Full API Test Suite
Tests all endpoints and saves results to Test_Result.txt
"""
import requests
import json
import os
import sys
from datetime import datetime

BASE = "http://localhost:8000"
RESULTS = []
PASS = 0
FAIL = 0

def log(msg, status="INFO"):
    line = f"[{status}] {msg}"
    print(line)
    RESULTS.append(line)

def test(name, method, url, expected_status=200, json_body=None, headers=None, files=None, token=None):
    global PASS, FAIL
    h = headers or {}
    if token:
        h["Authorization"] = f"Bearer {token}"
    try:
        if method == "GET":
            r = requests.get(BASE + url, headers=h, timeout=15)
        elif method == "POST":
            if files:
                r = requests.post(BASE + url, headers=h, files=files, timeout=15)
            else:
                r = requests.post(BASE + url, headers=h, json=json_body, timeout=15)
        elif method == "DELETE":
            r = requests.delete(BASE + url, headers=h, timeout=15)
        elif method == "PUT":
            r = requests.put(BASE + url, headers=h, json=json_body, timeout=15)

        ok = r.status_code == expected_status
        status = "PASS" if ok else "FAIL"
        if ok:
            PASS += 1
        else:
            FAIL += 1

        try:
            body = r.json()
            preview = json.dumps(body)[:120]
        except:
            preview = r.text[:120]

        log(f"{name} [{method} {url}] → {r.status_code} | {preview}", status)
        return r
    except Exception as e:
        FAIL += 1
        log(f"{name} [{method} {url}] → ERROR: {str(e)[:100]}", "FAIL")
        return None

# ─── Start ────────────────────────────────────────────────────────────────────
log("=" * 70)
log(f"LeafScan Full API Test Suite — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
log("=" * 70)

# ─── 1. Health Check ──────────────────────────────────────────────────────────
log("\n── 1. HEALTH CHECK ──────────────────────────────────────────────────────")
test("Root Health", "GET", "/")
test("API Docs", "GET", "/docs", expected_status=200)

# ─── 2. Auth Endpoints ────────────────────────────────────────────────────────
log("\n── 2. AUTH ENDPOINTS ────────────────────────────────────────────────────")
ts = datetime.now().strftime('%H%M%S')
TEST_USER = {"username": f"testuser{ts}", "email": f"test{ts}@leafscan.com", "password": "Test@1234", "full_name": "Test User"}

r_reg = test("Register", "POST", "/api/auth/register", 200, TEST_USER)
token = None
if r_reg and r_reg.status_code == 200:
    token = r_reg.json().get("access_token")
    log(f"  Token obtained: {token[:20]}...")

r_login = test("Login", "POST", "/api/auth/login",
               json_body={"email": TEST_USER["email"], "password": TEST_USER["password"]})
if r_login and r_login.status_code == 200 and not token:
    token = r_login.json().get("access_token")

test("Get Me (auth)", "GET", "/api/auth/me", token=token)
test("Get Me (no auth)", "GET", "/api/auth/me", expected_status=401)

# ─── 3. Chatbot ───────────────────────────────────────────────────────────────
log("\n── 3. CHATBOT (LiAn) ────────────────────────────────────────────────────")
test("Chatbot Status", "GET", "/api/chatbot/status")
test("Send Message (auth)", "POST", "/api/chatbot/message",
     json_body={"message": "my tomato is not getting bigger"}, token=token)
test("Send Message (no auth)", "POST", "/api/chatbot/message",
     json_body={"message": "hello"}, expected_status=401)
test("Get Chat History", "GET", "/api/chatbot/history", token=token)

# ─── 4. Crop Recommendation ───────────────────────────────────────────────────
log("\n── 4. CROP RECOMMENDATION ───────────────────────────────────────────────")
test("Model Status", "GET", "/api/crop-recommend/model-status")
test("Get All Crops", "GET", "/api/crop-recommend/crops")
r_crop = test("Predict Crops (auth)", "POST", "/api/crop-recommend/predict",
    json_body={
        "nitrogen": 80, "phosphorus": 48, "potassium": 40,
        "temperature": 25, "humidity": 70, "ph": 6.5, "rainfall": 120, "top_n": 3
    }, token=token)
if r_crop and r_crop.status_code == 200:
    recs = r_crop.json().get("recommendations", [])
    log(f"  Recommendations: {[r['crop_display'] for r in recs]}", "INFO")
test("Predict Crops (no auth)", "POST", "/api/crop-recommend/predict",
    json_body={"nitrogen": 80, "phosphorus": 48, "potassium": 40,
               "temperature": 25, "humidity": 70, "ph": 6.5, "rainfall": 120},
    expected_status=401)

# ─── 5. Diagnosis ─────────────────────────────────────────────────────────────
log("\n── 5. DIAGNOSIS ─────────────────────────────────────────────────────────")
test("Model Status", "GET", "/api/diagnosis/model-status")
test("Get All Diseases", "GET", "/api/diagnosis/diseases")
test("Get Diagnosis History", "GET", "/api/diagnosis/history", token=token)

# Create a tiny test image
import io
try:
    from PIL import Image
    img = Image.new('RGB', (224, 224), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    r_diag = test("Predict Disease (auth)", "POST", "/api/diagnosis/predict",
        files={"file": ("test_leaf.jpg", buf, "image/jpeg")}, token=token)
    if r_diag and r_diag.status_code == 200:
        d = r_diag.json()
        log(f"  Disease: {d.get('disease_name')} ({d.get('confidence', 0)*100:.1f}%)", "INFO")
except Exception as e:
    log(f"  Image test skipped: {e}", "INFO")

# ─── 6. Cultivation Tips ──────────────────────────────────────────────────────
log("\n── 6. CULTIVATION TIPS ──────────────────────────────────────────────────")
r_tips = test("Get All Tips", "GET", "/api/tips")
if r_tips and r_tips.status_code == 200:
    tips = r_tips.json()
    log(f"  Total crops: {len(tips)}", "INFO")
    log(f"  Crops: {[t['crop'] for t in tips[:5]]}...", "INFO")
test("Get Tip by ID", "GET", "/api/tips/1")
test("Get Tip by ID (invalid)", "GET", "/api/tips/999", expected_status=404)

# ─── 7. Weather ───────────────────────────────────────────────────────────────
log("\n── 7. WEATHER ───────────────────────────────────────────────────────────")
test("Get Weather", "GET", "/api/weather?city=London")
test("Get Weather Alerts", "GET", "/api/weather/alerts?city=London")

# ─── 8. Community ─────────────────────────────────────────────────────────────
log("\n── 8. COMMUNITY ─────────────────────────────────────────────────────────")
test("Get Posts", "GET", "/api/community/posts")
r_post = test("Create Post", "POST", "/api/community/posts",
    json_body={"title": "Test Post", "content": "Testing LeafScan community!", "tags": "test"},
    token=token)
if r_post and r_post.status_code == 200:
    post_id = r_post.json().get("id")
    test("Get Post by ID", "GET", f"/api/community/posts/{post_id}")
    test("Like Post", "POST", f"/api/community/posts/{post_id}/like", token=token)
    test("Add Comment", "POST", f"/api/community/posts/{post_id}/comments",
         json_body={"content": "Great post!"}, token=token)

# ─── 9. History ───────────────────────────────────────────────────────────────
log("\n── 9. HISTORY ───────────────────────────────────────────────────────────")
test("Get History", "GET", "/api/history", token=token)
test("Get History (no auth)", "GET", "/api/history", expected_status=401)

# ─── 10. Calculator ───────────────────────────────────────────────────────────
log("\n── 10. FERTILIZER CALCULATOR ────────────────────────────────────────────")
test("Calculate Fertilizer", "POST", "/api/calculator/calculate",
    json_body={"crop": "tomato", "area": 1.0, "area_unit": "hectare",
               "soil_n": 40, "soil_p": 30, "soil_k": 25, "target_yield": 20})

# ─── 11. Market Prices ────────────────────────────────────────────────────────
log("\n── 11. MARKET PRICES ────────────────────────────────────────────────────")
test("Get Market Prices", "GET", "/api/market/prices")
test("Get Market Crops", "GET", "/api/market/crops")

# ─── 12. Crop Calendar ────────────────────────────────────────────────────────
log("\n── 12. CROP CALENDAR ────────────────────────────────────────────────────")
test("Get Calendar", "GET", "/api/calendar")
test("Get Calendar by Crop", "GET", "/api/calendar?crop=tomato")

# ─── Summary ──────────────────────────────────────────────────────────────────
log("\n" + "=" * 70)
log(f"TEST SUMMARY: {PASS} PASSED | {FAIL} FAILED | {PASS+FAIL} TOTAL")
log(f"SUCCESS RATE: {PASS/(PASS+FAIL)*100:.1f}%" if (PASS+FAIL) > 0 else "No tests run")
log("=" * 70)

# Save to file
output_path = os.path.join(os.path.dirname(__file__), '..', 'Test_Result.txt')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(RESULTS))

print(f"\n✅ Results saved to Test_Result.txt")
