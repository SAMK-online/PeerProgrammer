from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
import logging
from app.models.session import (
    get_session,
    create_session,
    update_session,
    cleanup_old_sessions,
    add_message,
    get_conversation_summary,
    sessions,
)

logger = logging.getLogger(__name__)
router = APIRouter()

class ContextSyncRequest(BaseModel):
    """Request to sync context in background"""
    code: Optional[str] = Field(None, max_length=10000)
    problem_id: Optional[str] = Field(None)
    problem_title: Optional[str] = Field(None, description="Human-readable problem title")
    language: str = Field("python")
    hint_level: int = Field(0, ge=0, le=3)

class ContextSyncResponse(BaseModel):
    """Response from context sync"""
    session_id: str
    synced: bool
    message: str

@router.post("/sync", response_model=ContextSyncResponse)
async def sync_context(request: ContextSyncRequest, http_request: Request):
    """
    Background context sync endpoint.
    Called automatically by frontend every 5 seconds to keep context up-to-date.
    """
    client_ip = http_request.client.host
    session_id = http_request.headers.get("X-Session-ID", "")
    
    try:
        # Get or create session
        session = get_session(session_id) if session_id else None
        
        if not session:
            # Create new session
            session_id = str(uuid.uuid4())
            session = create_session(
                session_id=session_id,
                user_ip=client_ip,
                problem_id=request.problem_id,
                problem_title=request.problem_title,
                current_code=request.code or "",
                language=request.language,
                hint_level=request.hint_level,
            )
            logger.info(f"✨ Created new session: {session_id[:8]}... for {client_ip}")
        else:
            # Update existing session
            update_session(
                session_id=session_id,
                current_code=request.code if request.code is not None else session.current_code,
                problem_id=request.problem_id if request.problem_id is not None else session.problem_id,
                problem_title=request.problem_title if request.problem_title is not None else session.problem_title,
                language=request.language,
                hint_level=request.hint_level,
            )
            logger.info(f"🔄 Updated session: {session_id[:8]}... (problem_id={request.problem_id}, problem_title={request.problem_title}, code: {len(request.code or '')} chars)")
        
        return ContextSyncResponse(
            session_id=session_id,
            synced=True,
            message="Context synchronized successfully",
        )
    
    except Exception as e:
        logger.error(f"❌ Context sync error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to sync context"
        )

@router.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """Get current session information (for debugging)"""
    session = get_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return {
        "session_id": session.session_id,
        "problem_id": session.problem_id,
        "language": session.language,
        "hint_level": session.hint_level,
        "code_length": len(session.current_code),
        "message_count": session.message_count,
        "last_updated": session.last_updated.isoformat(),
        "created_at": session.created_at.isoformat(),
    }

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a session (logout/reset)"""
    if session_id in sessions:
        del sessions[session_id]
        logger.info(f"🗑️ Deleted session: {session_id[:8]}...")
        return {"message": "Session deleted"}
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Session not found"
    )

@router.get("/stats")
async def context_stats():
    """Get context service statistics"""
    total_sessions = len(sessions)
    active_sessions = sum(1 for s in sessions.values() if s.message_count > 0)
    total_messages = sum(s.message_count for s in sessions.values())
    
    return {
        "total_sessions": total_sessions,
        "active_sessions": active_sessions,
        "total_messages": total_messages,
        "avg_messages_per_session": total_messages / total_sessions if total_sessions > 0 else 0,
    }

@router.post("/cleanup")
async def cleanup_sessions(max_age_hours: int = 24):
    """Cleanup old sessions (admin endpoint)"""
    removed = cleanup_old_sessions(max_age_hours)
    logger.info(f"🧹 Cleaned up {removed} old sessions")
    return {
        "removed": removed,
        "remaining": len(sessions),
    }


class ConversationMessageRequest(BaseModel):
    """Request to add a conversation message"""
    role: str = Field(..., pattern="^(user|assistant)$", description="Message role: 'user' or 'assistant'")
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")


@router.post("/message")
async def add_conversation_message(request: ConversationMessageRequest, http_request: Request):
    """
    Add a message to the session's conversation history.
    Called by frontend after each voice/chat exchange.
    """
    session_id = http_request.headers.get("X-Session-ID", "")
    
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Session-ID header required"
        )
    
    session = get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    success = add_message(session_id, request.role, request.content)
    
    if success:
        logger.debug(f"💬 Added {request.role} message to {session_id[:8]}... ({len(request.content)} chars)")
        return {
            "success": True,
            "message_count": session.message_count,
            "history_size": len(session.conversation_history),
        }
    
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to add message"
    )


@router.get("/summary/{session_id}")
async def get_session_summary(session_id: str):
    """
    Get conversation summary for a session.
    Used by voice proxy to inject context.
    """
    summary = get_conversation_summary(session_id)
    session = get_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return {
        "session_id": session_id,
        "summary": summary,
        "message_count": session.message_count,
        "has_history": bool(session.conversation_history),
    }

