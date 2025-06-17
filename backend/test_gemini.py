import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Test if Gemini is responding
try:
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content("Give me a quick fitness tip.")
    print(response.text)
except Exception as e:
    print("🔥 Error:", e)
