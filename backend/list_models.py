import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# List all available models
try:
    models = genai.list_models()
    for model in models:
        print(model.name)
except Exception as e:
    print("🔥 Error:", e)