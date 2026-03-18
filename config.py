import os
from dotenv import load_dotenv

# Try to load from .env file if present
load_dotenv()

def get_gemini_api_key():
    # Will try environment variable or .env file
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        return api_key
    
    print("Warning: GEMINI_API_KEY not found in environment or .env file.")
    return None

SYSTEM_PROMPT = """You are an objective, fairness-aware AI Resume Screening Agent. 
Evaluate the candidate based strictly on skills, experience, and qualifications. 
Ignore demographic identifiers."""