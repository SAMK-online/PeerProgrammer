from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ConversationMessage(BaseModel):
    """A single message in the conversation history"""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.now)


class CodeSession(BaseModel):
    """
    Represents a user's coding session with cached context.
    This allows the backend to "remember" the user's state
    without requiring the frontend to resend everything.
    """
    session_id: str = Field(..., description="Unique session identifier")
    user_ip: str = Field(..., description="User's IP address (temporary auth)")
    problem_id: Optional[str] = Field(None, description="Current problem ID (slug)")
    problem_title: Optional[str] = Field(None, description="Current problem title (human-readable)")
    current_code: str = Field("", description="Latest code state")
    language: str = Field("python", description="Programming language")
    hint_level: int = Field(0, ge=0, le=3, description="Number of hints used")
    last_updated: datetime = Field(default_factory=datetime.now, description="Last sync timestamp")
    message_count: int = Field(0, description="Number of messages in this session")
    created_at: datetime = Field(default_factory=datetime.now, description="Session creation time")
    conversation_history: List[ConversationMessage] = Field(
        default_factory=list,
        description="Recent conversation messages for context continuity"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "550e8400-e29b-41d4-a716-446655440000",
                "user_ip": "127.0.0.1",
                "problem_id": "two-sum",
                "current_code": "def two_sum(nums, target):\n    pass",
                "language": "python",
                "hint_level": 1,
                "message_count": 5,
            }
        }

# In-memory session store
# TODO: Migrate to Firestore for production
sessions: dict[str, CodeSession] = {}

def get_session(session_id: str) -> Optional[CodeSession]:
    """Retrieve a session by ID"""
    return sessions.get(session_id)

def create_session(session_id: str, user_ip: str, **kwargs) -> CodeSession:
    """Create a new session"""
    session = CodeSession(
        session_id=session_id,
        user_ip=user_ip,
        **kwargs
    )
    sessions[session_id] = session
    return session

def update_session(session_id: str, **updates) -> Optional[CodeSession]:
    """Update an existing session"""
    session = sessions.get(session_id)
    if not session:
        return None
    
    for key, value in updates.items():
        if hasattr(session, key):
            setattr(session, key, value)
    
    session.last_updated = datetime.now()
    return session

def cleanup_old_sessions(max_age_hours: int = 24):
    """Remove sessions older than max_age_hours"""
    now = datetime.now()
    to_remove = []
    
    for session_id, session in sessions.items():
        age = (now - session.last_updated).total_seconds() / 3600
        if age > max_age_hours:
            to_remove.append(session_id)
    
    for session_id in to_remove:
        del sessions[session_id]
    
    return len(to_remove)


def add_message(session_id: str, role: str, content: str, max_messages: int = 20) -> bool:
    """
    Add a message to the session's conversation history.
    Keeps only the last max_messages to prevent memory bloat.
    """
    session = sessions.get(session_id)
    if not session:
        return False
    
    message = ConversationMessage(role=role, content=content)
    session.conversation_history.append(message)
    
    # Trim to last N messages to prevent memory issues
    if len(session.conversation_history) > max_messages:
        session.conversation_history = session.conversation_history[-max_messages:]
    
    session.message_count += 1
    session.last_updated = datetime.now()
    return True


def get_conversation_summary(session_id: str, max_exchanges: int = 5) -> str:
    """
    Build a concise summary of recent conversation for context injection.
    Returns empty string if no history.
    """
    session = sessions.get(session_id)
    if not session or not session.conversation_history:
        return ""
    
    # Get last N messages
    recent = session.conversation_history[-max_exchanges * 2:]  # 2 messages per exchange
    
    if not recent:
        return ""
    
    summary_lines = ["[PREVIOUS CONVERSATION SUMMARY]"]
    for msg in recent:
        role_label = "User" if msg.role == "user" else "You (AI)"
        # Truncate long messages
        content = msg.content[:150] + "..." if len(msg.content) > 150 else msg.content
        summary_lines.append(f"- {role_label}: {content}")
    
    summary_lines.append("[END OF SUMMARY - Continue from where we left off]")
    
    return "\n".join(summary_lines)

