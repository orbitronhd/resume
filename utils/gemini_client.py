import google.generativeai as genai
import json
from google.api_core.exceptions import ResourceExhausted
from config import get_gemini_api_key, SYSTEM_PROMPT

def initialize_gemini():
    api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("Gemini API Key not found.")
    genai.configure(api_key=api_key)

def process_with_gemini(prompt: str, text: str) -> dict:
    model = genai.GenerativeModel('gemini-2.5-flash')
    full_prompt = f"{SYSTEM_PROMPT}\n\nTask: {prompt}\n\nResume Text:\n{text}\n\nReturn ONLY a valid JSON object."
    
    try:
        response = model.generate_content(full_prompt)
    except ResourceExhausted:
        return {"error": "⚠️ API quota exhausted. Please create a new API key at https://aistudio.google.com/apikey (select 'new project') and update .streamlit/secrets.toml"}
    except Exception as e:
        return {"error": f"API call failed: {str(e)}"}
    
    try:
        # Strip markdown formatting if present
        cleaned_response = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(cleaned_response)
    except json.JSONDecodeError:
        return {"error": "Failed to parse Gemini response as JSON.", "raw_output": response.text}