"""
Chat API Schemas - Request/Response Models

These Pydantic models define the shape of data for the chat endpoint.
Benefits:
- Automatic validation (FastAPI rejects invalid requests)
- Auto-generated API documentation
- Type safety throughout the application
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    """
    Request body for POST /api/chat
    
    This is what the frontend sends when a user asks a question.
    """
    
    message: str = Field(
        ...,  # Required field
        min_length=1,
        max_length=1000,
        description="The user's question or message",
        example="Why doesn't my code work?"
    )
    
    code: Optional[str] = Field(
        None,  # Optional - user might not have code yet
        max_length=10000,
        description="The user's current code",
        example="def two_sum(nums, target):\n    pass"
    )
    
    problem_id: Optional[str] = Field(
        None,
        max_length=100,
        description="The problem they're working on",
        example="two-sum"
    )
    
    language: str = Field(
        default="python",
        description="Programming language",
        example="python"
    )
    
    hint_level: int = Field(
        default=0,
        ge=0,  # Greater than or equal to 0
        le=3,  # Less than or equal to 3
        description="Current hint level (0-3)",
        example=1
    )
    
    class Config:
        # Example for API docs
        schema_extra = {
            "example": {
                "message": "Can you explain how hash maps work?",
                "code": "def two_sum(nums, target):\n    for i in range(len(nums)):",
                "problem_id": "two-sum",
                "language": "python",
                "hint_level": 0
            }
        }


class ChatResponse(BaseModel):
    """
    Response body for POST /api/chat
    
    This is what the backend sends back to the frontend.
    """
    
    response: str = Field(
        ...,
        description="The AI mentor's response",
        example="Great question! A hash map is a data structure that stores key-value pairs..."
    )
    
    tokens_used: Optional[int] = Field(
        None,
        description="Number of tokens consumed (for cost tracking)",
        example=150
    )
    
    model: str = Field(
        default="gemini-pro",
        description="AI model used",
        example="gemini-pro"
    )
    
    session_id: Optional[str] = Field(
        None,
        description="Session ID for context caching (if available)",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "response": "I see you're working on Two Sum. Let me guide you: What data structure offers O(1) lookup time?",
                "tokens_used": 45,
                "model": "gemini-pro",
                "session_id": "550e8400-e29b-41d4-a716-446655440000"
            }
        }


class ErrorResponse(BaseModel):
    """
    Error response for any API errors
    """
    
    error: str = Field(
        ...,
        description="Error type",
        example="rate_limit_exceeded"
    )
    
    message: str = Field(
        ...,
        description="Human-readable error message",
        example="You've exceeded the rate limit. Please wait before trying again."
    )
    
    retry_after: Optional[int] = Field(
        None,
        description="Seconds to wait before retrying",
        example=60
    )

