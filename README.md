# Visplain

Turn any topic into a short, verified explainer video.

## Project Overview

Visplain is a FastAPI-based application that generates short (10-15s) explainer videos from topics.

### MVP Features
- **Input**: topic + audience + duration + style
- **Output**: 10-15s explainer video
- **Internals**:
  - 3-scene explanation
  - Single text-to-video generation
  - 3-frame self-check
  - Optional 1 retry
  - Subtitles burned in
- **Stack**: Static premium frontend, FastAPI backend
- **Infrastructure**: No training, no GPU hosting

## Setup

### Prerequisites
- Python 3.10+
- pip

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   - `HF_TOKEN`: Your Hugging Face API token (required for AI model access)

### Running the Application

Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Health Check

Verify the application is running:
```bash
curl http://localhost:8000/health
```

Expected response: `{"ok": true}`

## Project Structure

```
app/
  main.py          # FastAPI application entry point
  api/             # API routes
  core/            # Core configuration
  services/        # Business logic
  storage/         # Storage handlers
  web/             # Web frontend files
outputs/           # Generated video outputs
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
