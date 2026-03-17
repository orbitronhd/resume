import os
import sys
import io
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add parent directory to path so we can import existing modules
sys.path.insert(0, os.path.dirname(__file__))

from utils.file_processor import extract_text
from utils.gemini_client import initialize_gemini, process_with_gemini
from utils.anonymizer import anonymize_text
from core.ranking import evaluate_resume
from core.fairness import evaluate_fairness

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Gemini on startup
    try:
        initialize_gemini()
        print("✅ Gemini API initialized")
    except Exception as e:
        print(f"⚠️ Failed to initialize Gemini: {e}")
    yield

app = FastAPI(title="ResumeAI API", version="1.0.0", lifespan=lifespan)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze_resume_endpoint(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    # Validate file type
    filename = resume.filename or ""
    if not filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    
    # Read file content
    content = await resume.read()
    
    try:
        # Create a file-like wrapper for existing extract_text function
        file_wrapper = io.BytesIO(content)
        file_wrapper.name = filename
        
        # Step 1: Extract text
        print(f"📄 Extracting text from {filename}...")
        raw_text = extract_text(file_wrapper)
        print(f"   Extracted {len(raw_text)} characters")
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the file. Is it a scanned image PDF?")
        
        # Step 2: Anonymize
        print("🔒 Anonymizing text...")
        anonymized_text = anonymize_text(raw_text)
        print(f"   Anonymized text: {len(anonymized_text)} characters")
        
        # Step 3: Evaluate ranking (uses anonymized text)
        print("🎯 Evaluating resume ranking...")
        ranking = evaluate_resume(anonymized_text, job_description)
        print(f"   Ranking result: {ranking}")
        
        # Step 4: Evaluate fairness (uses raw text)
        print("🛡️ Evaluating fairness...")
        fairness = evaluate_fairness(raw_text)
        print(f"   Fairness result: {fairness}")
        
        # Check for errors from Gemini
        if isinstance(ranking, dict) and "error" in ranking:
            raise HTTPException(status_code=500, detail=ranking["error"])
        if isinstance(fairness, dict) and "error" in fairness:
            raise HTTPException(status_code=500, detail=fairness["error"])
        
        return {
            "anonymized_text": anonymized_text,
            "ranking": ranking,
            "fairness": fairness,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
