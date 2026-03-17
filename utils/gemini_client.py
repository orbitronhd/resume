from google import genai
from google.genai.errors import APIError
import json
from config import get_gemini_api_key, SYSTEM_PROMPT

_gemini_client = None

def initialize_gemini():
    global _gemini_client
    api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("Gemini API Key not found.")
    _gemini_client = genai.Client(api_key=api_key)

def process_with_gemini(prompt: str, text: str) -> dict:
    global _gemini_client
    if _gemini_client is None:
        initialize_gemini()
        
    full_prompt = f"{SYSTEM_PROMPT}\n\nTask: {prompt}\n\nResume Text:\n{text}\n\nReturn ONLY a valid JSON object."
    
    try:
        response = _gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt
        )
    except APIError as e:
        if e.code == 429: # ResourceExhausted
            return {"error": "⚠️ API quota exhausted. Please create a new API key at https://aistudio.google.com/apikey (select 'new project') and update .streamlit/secrets.toml"}
        return {"error": f"API call failed: {str(e)}"}
    except Exception as e:
        return {"error": f"API call failed: {str(e)}"}
    
    try:
        # Strip markdown formatting if present
        cleaned_response = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(cleaned_response)
    except json.JSONDecodeError:
        return {"error": "Failed to parse Gemini response as JSON.", "raw_output": getattr(response, 'text', '')}