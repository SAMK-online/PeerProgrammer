"""
Chat API Router

Handles the /api/chat endpoint for AI mentor conversations.

No authentication required (stateless MVP).
Rate limited by IP address.
"""

from fastapi import APIRouter, HTTPException, Request
from app.schemas.chat import ChatRequest, ChatResponse, ErrorResponse
from app.services.vertex_ai_service import vertex_ai_service
from app.utils.rate_limiter import rate_limit
from app.models.session import get_session, update_session
import logging

logger = logging.getLogger(__name__)

# Create router
# Tags group endpoints in API documentation
router = APIRouter(tags=["chat"])


@router.post(
    "",
    response_model=ChatResponse,
    responses={
        200: {"description": "Successful AI response"},
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "AI service error"}
    },
    summary="Chat with AI Mentor",
    description="""
    Send a message to the AI coding mentor.
    
    The AI has context awareness:
    - Sees the user's current code
    - Knows which problem they're working on
    - Adapts to their hint level
    
    Rate limit: 10 requests per minute per IP address
    
    Example request:
    ```json
    {
      "message": "Why doesn't my code work?",
      "code": "def two_sum(nums, target):\\n    for i in range(len(nums)):",
      "problem_id": "two-sum",
      "language": "python",
      "hint_level": 1
    }
    ```
    """
)
@rate_limit(max_requests=10, window_seconds=60)
async def chat(
    request: Request,
    chat_request: ChatRequest
):
    """
    Chat with the AI mentor.
    
    This is the main endpoint for AI conversations.
    
    Args:
        request: FastAPI Request object (for rate limiting)
        chat_request: Validated request body
    
    Returns:
        ChatResponse with AI's answer
    
    Raises:
        HTTPException: If AI service fails or rate limit exceeded
    """
    
    try:
        # Log request (helpful for debugging)
        client_ip = request.client.host if request.client else "unknown"
        logger.info(
            f"💬 Chat request from {client_ip}: "
            f'"{chat_request.message[:50]}..." '
            f"(problem: {chat_request.problem_id}, hint_level: {chat_request.hint_level})"
        )
        
        # Try to use cached context from session
        session_id = request.headers.get("X-Session-ID")
        session = get_session(session_id) if session_id else None
        
        if session:
            # Use cached context from session (saves tokens!)
            code = chat_request.code if chat_request.code is not None else session.current_code
            problem_id = chat_request.problem_id if chat_request.problem_id is not None else session.problem_id
            hint_level = chat_request.hint_level if chat_request.hint_level is not None else session.hint_level
            
            # Update session message count
            update_session(session_id, message_count=session.message_count + 1)
            
            logger.debug(
                f"📋 Using session context: {session_id[:8]}... "
                f"(code: {len(code)} chars, cached: {code == session.current_code})"
            )
        else:
            # No session - use request data directly (fallback)
            code = chat_request.code
            problem_id = chat_request.problem_id
            hint_level = chat_request.hint_level
            
            logger.debug("⚠️ No session found, using request context")
        
        # Call Vertex AI service
        result = await vertex_ai_service.generate_response(
            user_message=chat_request.message,
            code=code,
            problem_id=problem_id,
            hint_level=hint_level
        )
        
        # Log success
        logger.info(
            f"✅ Chat response generated: {result['tokens_used']} tokens used "
            f"(session: {'yes' if session else 'no'})"
        )
        
        # Return response (include session_id if available)
        return ChatResponse(
            response=result["response"],
            tokens_used=result["tokens_used"],
            model=result["model"],
            session_id=session_id if session else None
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (like rate limiting)
        raise
        
    except Exception as e:
        # Log error
        logger.error(f"❌ Chat endpoint error: {str(e)}", exc_info=True)
        
        # Return user-friendly error
        raise HTTPException(
            status_code=500,
            detail={
                "error": "ai_service_error",
                "message": "I'm having trouble connecting to the AI service. Please try again in a moment.",
                "technical_details": str(e) if logger.level == logging.DEBUG else None
            }
        )


@router.get(
    "/health",
    summary="Chat Service Health Check",
    description="Check if the chat service and AI integration are working"
)
async def chat_health():
    """
    Health check for chat service.
    
    Verifies:
    - Chat router is accessible
    - Vertex AI service is initialized
    
    Returns:
        Status information
    """
    
    try:
        # Check if Vertex AI service is initialized
        if vertex_ai_service.model is None:
            raise Exception("Vertex AI model not initialized")
        
        return {
            "status": "healthy",
            "service": "chat",
            "ai_model": "gemini-pro",
            "features": {
                "context_aware": True,
                "socratic_method": True,
                "rate_limited": True
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Chat health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "error": str(e)
            }
        )

