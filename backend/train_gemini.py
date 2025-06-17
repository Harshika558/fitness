import google.generativeai as genai
import chromadb
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize ChromaDB for storing knowledge
chroma_client = chromadb.PersistentClient(path="./fitness_db")
collection = chroma_client.get_or_create_collection("fitness_knowledge")

# Load fitness data
def load_fitness_data():
    with open("fitness_data.txt", "r", encoding="utf-8") as file:
        return file.readlines()

# Store fitness knowledge in ChromaDB
def train_model():
    fitness_data = load_fitness_data()
    for index, text in enumerate(fitness_data):
        collection.add(
            ids=[str(index)],
            documents=[text]
        )
    print("✅ Custom Fitness Data Stored Successfully!")

if __name__ == "__main__":
    train_model()
