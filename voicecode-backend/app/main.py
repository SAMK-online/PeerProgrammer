"""
VoiceCode Mentor Backend - Main Application

This is the entry point for the FastAPI backend.
Runs on Cloud Run (GCP serverless platform).

Architecture:
- FastAPI for API routes
- Firestore for database
- Vertex AI for Gemini integration
- Firebase Auth for authentication
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings, validate_settings
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered coding mentor with voice and chat interfaces",
    docs_url="/api/docs",      # Swagger UI
    redoc_url="/api/redoc",    # ReDoc UI
)

# CORS Middleware (allows frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)


# ============================================================================
# STARTUP & SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Called when the application starts.
    Initialize connections, validate configuration, etc.
    """
    logger.info("🚀 Starting VoiceCode Mentor API...")
    
    try:
        # Validate configuration
        validate_settings()
        
        # TODO: Initialize Firestore connection (Phase 2)
        # TODO: Initialize Vertex AI client (Phase 3)
        
        logger.info("✅ Application startup complete")
        logger.info(f"📍 Running in {settings.GCP_REGION}")
        logger.info(f"🔗 API Docs: http://localhost:{settings.PORT}/api/docs")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """
    Called when the application shuts down.
    Clean up connections, save state, etc.
    """
    logger.info("👋 Shutting down VoiceCode Mentor API...")
    
    # TODO: Close Firestore connection (Phase 2)
    # TODO: Clean up any resources
    
    logger.info("✅ Shutdown complete")


# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """
    Root endpoint - basic health check.
    Returns application information.
    """
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
        "message": "VoiceCode Mentor API is running! Visit /api/docs for documentation."
    }


@app.get("/health")
async def health_check():
    """
    Detailed health check endpoint.
    Used by Cloud Run to verify the service is healthy.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "gcp_project": settings.GCP_PROJECT_ID,
        "region": settings.GCP_REGION,
        # TODO: Add database health check (Phase 2)
        # TODO: Add AI service health check (Phase 3)
    }


@app.get("/api/info")
async def api_info():
    """
    API information endpoint.
    Returns available routes and configuration.
    """
    return {
        "endpoints": {
            "root": "/",
            "health": "/health",
            "docs": "/api/docs",
            "redoc": "/api/redoc",
            "chat": "/api/chat (POST)",
            "chat_health": "/api/chat/health (GET)",
            "voice_stream": "/api/voice/stream (WebSocket)",
            "voice_health": "/api/voice/health (GET)",
            "voice_stats": "/api/voice/stats (GET)",
        },
        "features": {
            "chat": "✅ Available (Vertex AI / Gemini Pro)",
            "voice": "✅ Available (ElevenLabs Conversational AI)",
            "context_awareness": "✅ AI sees your code",
            "socratic_method": "✅ Guided learning",
            "secure_proxy": "✅ API keys hidden on server",
            "code_execution": "Coming in Phase 4",
            "auth": "Coming in Phase 5",
        },
        "rate_limits": {
            "chat": "10 requests per minute (per IP)",
            "note": "Rate limits reset on server restart (in-memory)",
        }
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global error handler.
    Catches all unhandled exceptions and returns a JSON response.
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred",
            "request_id": request.headers.get("X-Request-ID", "unknown")
        }
    )


# ============================================================================
# ROUTERS
# ============================================================================

# Import routers
from app.routers import chat, voice, context

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(context.router, prefix="/api/context", tags=["context"])
# TODO Phase 4: app.include_router(execute.router, prefix="/api/execute", tags=["execute"])
# TODO Phase 5: app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# TODO Phase 6: app.include_router(progress.router, prefix="/api/progress", tags=["progress"])


# ============================================================================
# RUN SERVER (Local Development)
# ============================================================================

if __name__ == "__main__":
    """
    Run the server locally with: python -m app.main
    Cloud Run will use: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    """
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,  # Auto-reload on code changes (dev only)
        log_level="info"
    )

