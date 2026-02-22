import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv()

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    r = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents="my tomato is not getting bigger. give 3 quick tips.",
        config=types.GenerateContentConfig(
            system_instruction="You are LiAn, expert agricultural AI. Be concise.",
            max_output_tokens=150
        )
    )
    print("SUCCESS:", r.text[:300])
except Exception as e:
    print("FAIL gemini-2.5-flash:", str(e)[:200])
    try:
        r2 = client.models.generate_content(
            model="models/gemini-2.0-flash-lite",
            contents="my tomato is not getting bigger. give 3 quick tips.",
            config=types.GenerateContentConfig(max_output_tokens=150)
        )
        print("SUCCESS with gemini-2.0-flash-lite:", r2.text[:300])
    except Exception as e2:
        print("FAIL gemini-2.0-flash-lite:", str(e2)[:200])
