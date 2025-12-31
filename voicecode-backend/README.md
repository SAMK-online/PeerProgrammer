# VoiceCode Mentor Backend

Python FastAPI backend deployed on Google Cloud Platform (GCP).

## Architecture

- **Framework**: FastAPI (Python 3.11+)
- **Database**: Cloud Firestore (NoSQL)
- **Auth**: Firebase Authentication
- **AI**: Vertex AI (Gemini Pro)
- **Deployment**: Cloud Run (serverless)
- **Cost**: FREE with $300 GCP credits (6-12 months)

## Project Structure

```
voicecode-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic (Firestore, Vertex AI, etc.)
│   ├── schemas/             # Pydantic models (request/response)
│   └── utils/               # Helper functions
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variable template
└── README.md               # This file
```

## Setup (Local Development)

### 1. Install Python 3.11+

```bash
# Check Python version
python --version  # Should be 3.11 or higher
```

### 2. Create Virtual Environment

```bash
cd voicecode-backend
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your GCP Project ID
nano .env
```

Required in `.env`:
```
GCP_PROJECT_ID=your-actual-project-id
```

### 5. Run Development Server

```bash
# From voicecode-backend directory
python -m app.main

# Or use uvicorn directly:
uvicorn app.main:app --reload --port 8080
```

Server will start at: http://localhost:8080

- **API Docs (Swagger)**: http://localhost:8080/api/docs
- **API Docs (ReDoc)**: http://localhost:8080/api/redoc
- **Health Check**: http://localhost:8080/health

## Current Status (Phase 1: Foundation)

✅ **Completed:**
- FastAPI application structure
- Configuration management
- Health check endpoints
- CORS middleware (frontend can call backend)
- Logging setup
- Error handling

🚧 **Coming Next (Phase 2):**
- Firebase Authentication
- Firestore database integration
- User management

## Development Phases

### Phase 1: Foundation (Current) ✅
- Basic FastAPI app
- Configuration
- Health checks

### Phase 2: Authentication & Database
- Firebase Auth integration
- Firestore setup
- User models

### Phase 3: Chat API
- Vertex AI (Gemini) integration
- Chat endpoint
- Context management

### Phase 4: Voice API
- ElevenLabs proxy
- WebSocket support
- Voice session management

### Phase 5: Code Execution
- Cloud Run Jobs for safe code execution
- Multi-language support (Python, JavaScript, Java)
- Docker containers

### Phase 6: Progress Tracking
- Problem attempts tracking
- Analytics
- Spaced repetition algorithm

## Testing

```bash
# Run tests (when added)
pytest

# Run with coverage
pytest --cov=app
```

## Deployment to GCP Cloud Run

Coming in later phase. Will use:
```bash
gcloud run deploy voicecode-api --source .
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | Yes | None |
| `DEBUG` | Enable debug mode | No | False |
| `PORT` | Server port | No | 8080 |
| `GCP_REGION` | GCP region | No | us-central1 |

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8080/api/docs
- ReDoc: http://localhost:8080/api/redoc

## Troubleshooting

### Port already in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Module not found
```bash
# Make sure virtual environment is activated
source venv/bin/activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Import errors
```bash
# Run from project root
cd voicecode-backend
python -m app.main
```

## License

MIT License - See LICENSE file in project root

