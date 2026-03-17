import re
import spacy

# Automatically download the required spaCy model if missing
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    print("Downloading spaCy model via uv...")
    subprocess.run(["uv", "pip", "install", "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl"], check=True)
    nlp = spacy.load("en_core_web_sm")

def anonymize_text(text: str) -> str:
    """
    Redacts Personally Identifiable Information (PII) and demographic indicators
    (Names, Locations, Dates, Emails, Phones) from the raw text using Regex and NER.
    """
    # 1. Regex Redaction for strict patterns
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', '[EMAIL REDACTED]', text)
    text = re.sub(r'\(?\b\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE REDACTED]', text)
    
    # 2. Named Entity Recognition (NER) for contextual PII
    doc = nlp(text)
    redacted_text = text
    
    # Sort entities by start index in descending order to prevent index shifting during string replacement
    for ent in sorted(doc.ents, key=lambda x: x.start_char, reverse=True):
        if ent.label_ == "PERSON":
            redacted_text = redacted_text[:ent.start_char] + "[PERSON REDACTED]" + redacted_text[ent.end_char:]
        elif ent.label_ in ["GPE", "LOC", "FAC"]:
            redacted_text = redacted_text[:ent.start_char] + "[LOCATION REDACTED]" + redacted_text[ent.end_char:]
        elif ent.label_ == "DATE":
            redacted_text = redacted_text[:ent.start_char] + "[DATE REDACTED]" + redacted_text[ent.end_char:]
            
    return redacted_text