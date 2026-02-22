"""Final comprehensive API test for LeafScan."""
import urllib.request
import json
import os

BASE = "http://localhost:8000"
results = []

def check(name, url, method="GET", data=None, headers=None):
    try:
        req = urllib.request.Request(url, method=method)
        if headers:
            for k, v in headers.items():
                req.add_header(k, v)
        if data:
            req.data = json.dumps(data).encode()
            req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=8) as r:
            body = r.read().decode()[:200]
            results.append(f"✅ {name} -> {r.status}")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:100]
        results.append(f"⚠️  {name} -> HTTP {e.code}: {body}")
    except Exception as e:
        results.append(f"❌ {name} -> {e}")
    return {}

# ── Core Health ───────────────────────────────────────────────────────────────
check("Root /",                    f"{BASE}/")
check("Health /api/health",        f"{BASE}/api/health")

# ── Diagnosis ─────────────────────────────────────────────────────────────────
r = check("Model Status",          f"{BASE}/api/diagnosis/model-status")
check("All Diseases",              f"{BASE}/api/diagnosis/diseases")

# ── Chatbot ───────────────────────────────────────────────────────────────────
r = check("LiAn Status",           f"{BASE}/api/chatbot/status")

# ── Tips ──────────────────────────────────────────────────────────────────────
check("Tips (20 crops)",           f"{BASE}/api/tips")

# ── Crop Recommend ────────────────────────────────────────────────────────────
check("Crop Recommend Status",     f"{BASE}/api/crop-recommend/model-status")
check("Crop Recommend List",       f"{BASE}/api/crop-recommend/crops")

# ── Weather ───────────────────────────────────────────────────────────────────
check("Weather",                   f"{BASE}/api/weather?city=London")

# ── Market ────────────────────────────────────────────────────────────────────
check("Market Prices",             f"{BASE}/api/market/prices")

# ── Calendar ──────────────────────────────────────────────────────────────────
check("Crop Calendar",             f"{BASE}/api/calendar/crops")

# ── Calculator ────────────────────────────────────────────────────────────────
check("Fertilizer Crops",          f"{BASE}/api/calculator/crops")

# ── Print Results ─────────────────────────────────────────────────────────────
print("\n" + "="*55)
print("  LeafScan API — Final Test Results")
print("="*55)
for r in results:
    print(r)

passed = sum(1 for r in results if r.startswith("✅"))
total = len(results)
print(f"\n{'='*55}")
print(f"  PASSED: {passed}/{total}")
print("="*55)

# Save results
with open(os.path.join(os.path.dirname(__file__), "final_test_results.txt"), "w") as f:
    f.write("\n".join(results) + f"\n\nPASSED: {passed}/{total}\n")
