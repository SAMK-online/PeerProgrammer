"""
Configuration Management for VoiceCode Backend

This file manages all environment variables and GCP settings.
Uses pydantic-settings for type-safe configuration.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Environment variables are loaded from:
    1. .env file (local development)
    2. Environment variables (Cloud Run deployment)
    3. GCP Secret Manager (production secrets)
    """
    
    # Application Settings
    APP_NAME: str = "VoiceCode Mentor API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server Settings
    PORT: int = 8080
    HOST: str = "0.0.0.0"
    
    # GCP Project Configuration
    GCP_PROJECT_ID: Optional[str] = None
    GCP_REGION: str = "us-central1"
    
    # CORS Settings (for frontend)
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:5174",  # Vite dev server (alternative port)
        "http://localhost:3000",  # Alternative dev port
        "https://voicecode-mentor.vercel.app",  # Production frontend
    ]
    
    # Firebase Auth (will add later)
    FIREBASE_PROJECT_ID: Optional[str] = None
    
    # API Keys (loaded from Secret Manager in production)
    GEMINI_API_KEY: Optional[str] = None
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_AGENT_ID: Optional[str] = None
    
    # Rate Limiting (requests per minute)
    RATE_LIMIT_FREE_TIER: int = 10
    RATE_LIMIT_PRO_TIER: int = 100
    
    class Config:
        # Load from .env file
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create global settings instance
settings = Settings()


# Validation: Ensure required settings are present
def validate_settings():
    """
    Validate that all required settings are configured.
    Called on application startup.
    """
    if not settings.GCP_PROJECT_ID:
        raise ValueError(
            "GCP_PROJECT_ID is required. Set it in .env or environment variables."
        )
    
    if not settings.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is required for chat functionality. "
            "Get it from: https://makersuite.google.com/app/apikey"
        )
    
    print(f"✅ Configuration loaded successfully")
    print(f"   Project: {settings.GCP_PROJECT_ID}")
    print(f"   Region: {settings.GCP_REGION}")
    print(f"   Debug: {settings.DEBUG}")
    print(f"   Gemini API Key: {'*' * 20}{settings.GEMINI_API_KEY[-4:]}")
    
    # Optional: ElevenLabs (for voice features)
    if settings.ELEVENLABS_API_KEY and settings.ELEVENLABS_AGENT_ID:
        print(f"   ElevenLabs: ✅ Configured")
    else:
        print(f"   ElevenLabs: ⚠️ Not configured (voice features disabled)")

