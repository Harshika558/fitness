from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

ALLOWED_TOPICS = ["workout", "exercise", "gym", "nutrition", "calories","protein", "muscle", "weight loss", "fat loss", "healthy food", "cardio", "meal prep", "fitness"]

@app.route("/chat", methods=["POST"])
def chat_with_gemini():
    try:
        data = request.json
        user_message = data.get("message", "").lower()

        if not any(topic in user_message for topic in ALLOWED_TOPICS):
            return jsonify({"reply": "Hey I am a fitness bot! I only answer fitness & nutrition-related questions!"})

        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(user_message)

        if response and hasattr(response, "candidates") and response.candidates:
            bot_reply = response.candidates[0].content.parts[0].text
        else:
            bot_reply = "I couldn't find a proper fitness-related answer."

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("🔥 Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
