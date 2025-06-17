import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Test the trained chatbot
try:
    model = genai.GenerativeModel("gemini-1.5-pro")  # Use the correct model name
    response = model.generate_content("Give me a workout for fat loss.")
    print(response.text)
except Exception as e:
    print("🔥 Error:", e)
