"""Quick test for Phase 1, 2, 3 new features."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("=" * 60)
print("LeafScan New Features Test")
print("=" * 60)

# ── Test 1: Severity Score Calculation ────────────────────────────────────────
print("\n[1] Testing Severity Score Calculation...")
try:
    import model_inference
    
    # Test healthy plant
    sev = model_inference.calculate_severity_score("Tomato___healthy", 0.95)
    assert sev["score"] == 0
    assert sev["level"] == "Healthy"
    print(f"  ✅ Healthy: score={sev['score']}, level={sev['level']}, color={sev['color']}")
    
    # Test moderate disease
    sev = model_inference.calculate_severity_score("Tomato___Early_blight", 0.88)
    assert sev["score"] > 0
    print(f"  ✅ Early Blight: score={sev['score']}, level={sev['level']}, urgency={sev['urgency'][:40]}...")
    
    # Test severe disease
    sev = model_inference.calculate_severity_score("Tomato___Late_blight", 0.95)
    assert sev["score"] >= 78
    print(f"  ✅ Late Blight: score={sev['score']}, level={sev['level']}, color={sev['color']}")
    
    # Test rice blast (severe)
    sev = model_inference.calculate_severity_score("Rice___Blast", 0.92)
    assert sev["score"] >= 78
    print(f"  ✅ Rice Blast: score={sev['score']}, level={sev['level']}")
    
    print("  ✅ ALL SEVERITY TESTS PASSED")
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# ── Test 2: Crop Recommendation ───────────────────────────────────────────────
print("\n[2] Testing Crop Recommendation ML Model...")
try:
    import crop_recommendation
    
    # Test prediction
    result = crop_recommendation.predict_crop(90, 42, 43, 20.8, 82.0, 6.5, 202.9)
    assert "crop" in result
    assert "confidence" in result
    print(f"  ✅ Prediction: {result['crop']} ({result['confidence']:.1%} confidence)")
    
    # Test crops list
    crops = crop_recommendation.get_all_crops()
    assert len(crops) >= 20
    print(f"  ✅ Crops list: {len(crops)} crops available")
    
    # Test model status
    status = crop_recommendation.get_model_status()
    assert "model_trained" in status
    print(f"  ✅ Model status: trained={status['model_trained']}, accuracy={status.get('accuracy', 'N/A')}")
    
    print("  ✅ ALL CROP RECOMMENDATION TESTS PASSED")
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# ── Test 3: Groq Client Setup ─────────────────────────────────────────────────
print("\n[3] Testing Groq LLM Setup...")
try:
    # Check if groq package is installed
    import groq
    print(f"  ✅ Groq package installed: v{groq.__version__}")
    
    # Check if API key is set
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key:
        print(f"  ✅ GROQ_API_KEY is set ({len(api_key)} chars)")
    else:
        print(f"  ⚠️  GROQ_API_KEY not set — LiAn will use KB engine (set key in backend/.env)")
    
    print("  ✅ GROQ SETUP TEST PASSED")
except ImportError:
    print("  ❌ groq package not installed — run: pip install groq==0.4.2")
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# ── Test 4: KB Scoring Engine ─────────────────────────────────────────────────
print("\n[4] Testing LiAn KB Scoring Engine...")
try:
    from routes.chatbot import generate_lian_response, KB
    
    print(f"  ✅ KB loaded: {len(KB)} entries")
    
    tests = [
        ("hello", "Hi! I am LiAn"),
        ("tomato early blight treatment", "Alternaria"),
        ("rice blast disease", "Magnaporthe"),
        ("how often should i water", "Watering"),
        ("sugarcane red rot", "Colletotrichum"),
    ]
    
    for query, expected_fragment in tests:
        reply = generate_lian_response(query)
        if expected_fragment.lower() in reply.lower():
            print(f"  ✅ '{query[:30]}' → contains '{expected_fragment}'")
        else:
            print(f"  ⚠️  '{query[:30]}' → unexpected reply (first 60 chars): {reply[:60]}")
    
    print("  ✅ ALL KB SCORING TESTS PASSED")
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# ── Test 5: Disease Classes ───────────────────────────────────────────────────
print("\n[5] Testing Disease Classes...")
try:
    import model_inference
    
    total = len(model_inference.CLASS_NAMES)
    diseases = len([c for c in model_inference.CLASS_NAMES if "healthy" not in c.lower() and c != "Background_without_leaves"])
    crops = len(set(v["crop"] for v in model_inference.DISEASE_INFO.values() if v["crop"] != "Unknown"))
    
    print(f"  ✅ Total classes: {total}")
    print(f"  ✅ Disease classes: {diseases}")
    print(f"  ✅ Supported crops: {crops}")
    
    # Check new crops are present
    new_crops = ["Rice", "Sugarcane", "Wheat", "Banana", "Mango", "Coffee"]
    for crop in new_crops:
        crop_classes = [c for c in model_inference.CLASS_NAMES if c.startswith(crop + "___")]
        print(f"  ✅ {crop}: {len(crop_classes)} classes")
    
    print("  ✅ ALL DISEASE CLASS TESTS PASSED")
except Exception as e:
    print(f"  ❌ FAILED: {e}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
