# ResumeAI

An AI-powered resume screening tool designed for fair, fast, and objective candidate evaluation. 

ResumeAI leverages Gemini 2.5 Flash to score resumes against job descriptions, detect demographic indicators to reduce unconscious bias, and automatically redact Personally Identifiable Information (PII) before analysis.

## Project Structure

The project is split into two halves:
- **Backend (`/api_server.py`)**: A Python FastAPI server that handles document parsing (`.pdf`, `.docx`), PII anonymization via `spaCy`, and prompting the Gemini AI for analysis.
- **Frontend (`/frontend/`)**: A modern React application built with Vite, Tailwind CSS, and shadcn-ui, offering a sleek dark-mode interface for uploading resumes and viewing insights.

## Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/en)
- A [Google Gemini API Key](https://aistudio.google.com/apikey)

## Setup & Installation

### 1. Backend Setup
Navigate to the root directory and install Python dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```

Start the FastAPI server:
```bash
python api_server.py
```
*The backend runs on `http://localhost:8000`.*

### 2. Frontend Setup
Open a new terminal, navigate to the `frontend` folder, and install the Node dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

## Features
- **Smart Ranking:** Objective 0-100 scoring system identifying key strengths and skill gaps.
- **Bias Detection:** Scans for gendered language and other demographic identifiers.
- **PII Anonymization:** Redacts names, emails, phones, and locations to ensure blind screening.