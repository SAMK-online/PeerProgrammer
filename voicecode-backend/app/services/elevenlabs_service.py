"""
ElevenLabs Service - Voice AI Integration

Handles communication with ElevenLabs Conversational AI API.
This is the "voice" equivalent of our Vertex AI service for chat.

Why ElevenLabs?
- Conversational AI (not just text-to-speech)
- Natural turn-taking (handles interruptions)
- Low latency (<1 second)
- Professional voice quality

This service acts as a secure proxy between frontend and ElevenLabs.
"""

import asyncio
import logging
from typing import Optional, Callable
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class ElevenLabsService:
    """
    Wrapper for ElevenLabs Conversational AI API.
    
    Unlike chat (request/response), voice requires:
    - WebSocket connection (bidirectional)
    - Real-time audio streaming
    - Session management
    - Connection state tracking
    
    This service manages those complexities.
    """
    
    def __init__(self):
        """
        Initialize ElevenLabs service.
        
        Configuration loaded from settings (API key from .env or Secret Manager).
        """
        self.api_key = settings.ELEVENLABS_API_KEY
        self.agent_id = settings.ELEVENLABS_AGENT_ID
        self.base_url = "wss://api.elevenlabs.io/v1/convai/conversation"
        
        # Validate configuration
        if not self.api_key:
            logger.warning(
                "⚠️ ELEVENLABS_API_KEY not configured. "
                "Voice features will not work."
            )
        
        if not self.agent_id:
            logger.warning(
                "⚠️ ELEVENLABS_AGENT_ID not configured. "
                "Voice features will not work."
            )
        
        logger.info("✅ ElevenLabs service initialized")
    
    
    def get_connection_url(self) -> str:
        """
        Build WebSocket URL for ElevenLabs connection.
        
        URL format:
        wss://api.elevenlabs.io/v1/convai/conversation?agent_id=xxx
        
        Returns:
            WebSocket URL with agent ID and API key in query params
        """
        return f"{self.base_url}?agent_id={self.agent_id}"
    
    
    def get_auth_headers(self) -> dict:
        """
        Build authentication headers for ElevenLabs API.
        
        API key is sent in the xi-api-key header.
        
        Returns:
            Dictionary of HTTP headers
        """
        return {
            "xi-api-key": self.api_key,
        }
    
    
    async def validate_connection(self) -> bool:
        """
        Validate that ElevenLabs is configured.
        
        Note: We skip the actual API test because some endpoints require
        different permissions. The WebSocket connection will fail gracefully
        if credentials are invalid.
        
        Returns:
            True if API key and agent ID are configured
        """
        is_configured = bool(self.api_key and self.agent_id)
        
        if is_configured:
            logger.info("✅ ElevenLabs credentials configured")
        else:
            logger.warning("⚠️  ElevenLabs credentials missing")
        
        return is_configured
    
    
    def calculate_cost(self, characters_spoken: int) -> float:
        """
        Calculate cost of voice interaction.
        
        ElevenLabs pricing:
        - Conversational AI: $0.30 per 1000 characters
        - Characters = text sent to TTS + text from STT
        
        Args:
            characters_spoken: Total characters in conversation
        
        Returns:
            Cost in USD
        """
        cost_per_1k = 0.30
        return (characters_spoken / 1000) * cost_per_1k
    
    
    def estimate_minutes_from_characters(self, characters: int) -> float:
        """
        Estimate voice minutes from character count.
        
        Rule of thumb:
        - Average speaking rate: 150 words per minute
        - Average word length: 5 characters
        - So: 750 characters per minute of speech
        
        Args:
            characters: Total characters spoken
        
        Returns:
            Estimated minutes of voice conversation
        """
        chars_per_minute = 750
        return characters / chars_per_minute


# Create singleton instance
elevenlabs_service = ElevenLabsService()

