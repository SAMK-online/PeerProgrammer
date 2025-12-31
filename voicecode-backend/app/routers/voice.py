"""
Voice API Router - WebSocket Proxy for ElevenLabs

Handles real-time voice conversations through WebSocket connections.

Key Differences from Chat API:
- Chat: HTTP POST (one request, one response)
- Voice: WebSocket (persistent bidirectional connection)

Architecture:
    Frontend (WebSocket) ←→ Our Backend (Proxy) ←→ ElevenLabs (WebSocket)
    
Audio flows in both directions simultaneously:
- Frontend → Backend → ElevenLabs (user speaking)
- ElevenLabs → Backend → Frontend (AI responding)
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.websockets import WebSocketState
import websockets
import asyncio
import logging
import json
import base64
from datetime import datetime
from app.services.elevenlabs_service import elevenlabs_service
from app.config import settings
from app.models.session import get_session, get_conversation_summary

logger = logging.getLogger(__name__)

router = APIRouter(tags=["voice"])


# Track active connections for monitoring
active_connections = {}


@router.websocket("/stream")
async def voice_stream(websocket: WebSocket, session_id: str = None):
    """
    WebSocket endpoint for voice conversation streaming with context awareness.
    
    This is a proxy that sits between the frontend and ElevenLabs.
    Now with SESSION CONTEXT INTEGRATION!
    
    Flow:
    1. Frontend connects with session_id → our WebSocket
    2. We load cached context from session
    3. We connect to ElevenLabs WebSocket (with secure API key)
    4. We inject context as first message to ElevenLabs
    5. Forward audio/messages bidirectionally
    6. Track usage, handle errors, close gracefully
    
    URL: ws://localhost:8080/api/voice/stream?session_id=xxx
    
    Why WebSocket?
    - HTTP: One request → One response (stateless)
    - WebSocket: Persistent connection (stateful)
    - Allows real-time bidirectional communication
    """
    
    # Accept client connection
    await websocket.accept()
    
    client_ip = websocket.client.host if websocket.client else "unknown"
    connection_id = f"{client_ip}_{datetime.now().timestamp()}"
    
    logger.info(f"🎤 Voice connection opened: {connection_id} (session: {session_id[:8] if session_id else 'none'}...)")
    
    # Check if ElevenLabs is configured
    if not elevenlabs_service.api_key or not elevenlabs_service.agent_id:
        await websocket.send_json({
            "type": "error",
            "message": "Voice service not configured. Please set ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID."
        })
        await websocket.close()
        return
    
    # Track connection
    active_connections[connection_id] = {
        "client_ip": client_ip,
        "connected_at": datetime.now(),
        "characters_used": 0
    }
    
    elevenlabs_ws = None
    
    try:
        # Connect to ElevenLabs WebSocket
        url = elevenlabs_service.get_connection_url()
        headers = elevenlabs_service.get_auth_headers()
        
        logger.info(f"🔗 Connecting to ElevenLabs for {connection_id}...")
        
        # Open connection to ElevenLabs
        elevenlabs_ws = await websockets.connect(
            url,
            extra_headers=headers,  # Pass authentication headers
            ping_interval=20,  # Keep-alive ping every 20 seconds
            ping_timeout=10
        )
        
        logger.info(f"✅ ElevenLabs connected for {connection_id}")
        
        # 🎯 INJECT CONTEXT if session exists
        if session_id:
            session = get_session(session_id)
            logger.info(f"🔍 Session lookup: session_id={session_id[:8]}..., found={session is not None}")

            if session:
                logger.info(f"📊 Session data: problem={session.problem_id}, code_len={len(session.current_code) if session.current_code else 0}, hist_len={len(session.conversation_history)}")

            # ✅ IMMEDIATELY send context focused on CODE (hardcoded to Two Sum for demo)
            if session:
                # Build context message focused on their code
                context_message = "⚠️ CONTEXT: The student is working on the Two Sum problem.\n\n"
                
                if session.current_code and len(session.current_code.strip()) > 0:
                    # Send full code (up to 800 chars) so AI can analyze it
                    code_snippet = session.current_code[:800] + ("..." if len(session.current_code) > 800 else "")
                    context_message += f"Here's their current {session.language} code:\n\n{code_snippet}\n\n"
                    context_message += "You can see their code. Help them find errors, suggest improvements, or guide them with the Socratic method."
                else:
                    context_message += "They haven't written any code yet. Help them get started!"
                
                try:
                    # Send context as the very first message
                    await elevenlabs_ws.send(json.dumps({
                        "type": "text",
                        "text": context_message
                    }))
                    code_len = len(session.current_code) if session.current_code else 0
                    logger.info(f"✅ Context sent: problem=two-sum, code_len={code_len}")
                    
                    # Small delay to ensure context is processed
                    await asyncio.sleep(0.3)
                    
                except Exception as e:
                    logger.warning(f"⚠️  Failed to send context: {e}")
        
        # Start bidirectional forwarding
        # We need two concurrent tasks:
        # 1. Frontend → ElevenLabs
        # 2. ElevenLabs → Frontend
        
        await asyncio.gather(
            forward_client_to_elevenlabs(websocket, elevenlabs_ws, connection_id),
            forward_elevenlabs_to_client(elevenlabs_ws, websocket, connection_id),
            return_exceptions=True
        )
        
    except websockets.exceptions.WebSocketException as e:
        logger.error(f"❌ ElevenLabs WebSocket error for {connection_id}: {str(e)}")
        
        # Notify client
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({
                "type": "error",
                "message": "Lost connection to voice service"
            })
    
    except Exception as e:
        logger.error(f"❌ Voice stream error for {connection_id}: {str(e)}", exc_info=True)
        
        # Notify client
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({
                "type": "error",
                "message": "An error occurred in the voice service"
            })
    
    finally:
        # Clean up connections
        if elevenlabs_ws and not elevenlabs_ws.closed:
            await elevenlabs_ws.close()
            logger.info(f"🔌 ElevenLabs connection closed for {connection_id}")
        
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.close()
        
        # Log usage
        if connection_id in active_connections:
            conn_info = active_connections[connection_id]
            duration = (datetime.now() - conn_info["connected_at"]).seconds
            characters = conn_info["characters_used"]
            cost = elevenlabs_service.calculate_cost(characters)
            minutes = elevenlabs_service.estimate_minutes_from_characters(characters)
            
            logger.info(
                f"📊 Voice session ended: {connection_id}\n"
                f"   Duration: {duration}s\n"
                f"   Characters: {characters}\n"
                f"   Est. minutes: {minutes:.2f}\n"
                f"   Est. cost: ${cost:.4f}"
            )
            
            del active_connections[connection_id]
        
        logger.info(f"👋 Voice connection closed: {connection_id}")


async def forward_client_to_elevenlabs(
    client_ws: WebSocket,
    elevenlabs_ws: websockets.WebSocketClientProtocol,
    connection_id: str
):
    """
    Forward messages from client (frontend) to ElevenLabs.
    
    This runs continuously in the background, listening for messages
    from the frontend and forwarding them to ElevenLabs.
    
    Args:
        client_ws: WebSocket connection to frontend
        elevenlabs_ws: WebSocket connection to ElevenLabs
        connection_id: Unique connection identifier
    """
    try:
        while True:
            # Receive message from client
            # This can be text (JSON) or binary (audio)
            message = await client_ws.receive()
            
            # Check if client disconnected
            if message.get("type") == "websocket.disconnect":
                logger.info(f"📴 Client disconnected: {connection_id}")
                break
            
            # Forward to ElevenLabs
            if "text" in message:
                # Text message (JSON control messages)
                await elevenlabs_ws.send(message["text"])
                logger.debug(f"→ Forwarded text to ElevenLabs: {connection_id}")
                
                # Track characters (for cost calculation)
                if connection_id in active_connections:
                    text_data = json.loads(message["text"])
                    if "text" in text_data:
                        active_connections[connection_id]["characters_used"] += len(text_data["text"])
            
            elif "bytes" in message:
                # Binary message (audio data)
                # ElevenLabs expects audio as base64-encoded JSON
                audio_base64 = base64.b64encode(message["bytes"]).decode('utf-8')
                audio_message = json.dumps({
                    "user_audio_chunk": audio_base64
                })
                await elevenlabs_ws.send(audio_message)
                logger.debug(f"→ Forwarded audio to ElevenLabs: {connection_id} ({len(message['bytes'])} bytes)")
    
    except WebSocketDisconnect:
        logger.info(f"📴 Client WebSocket disconnected: {connection_id}")
    
    except Exception as e:
        logger.error(f"❌ Error forwarding to ElevenLabs for {connection_id}: {str(e)}")


async def forward_elevenlabs_to_client(
    elevenlabs_ws: websockets.WebSocketClientProtocol,
    client_ws: WebSocket,
    connection_id: str
):
    """
    Forward messages from ElevenLabs to client (frontend).
    
    This runs continuously in the background, listening for messages
    from ElevenLabs and forwarding them to the frontend.
    
    Args:
        elevenlabs_ws: WebSocket connection to ElevenLabs
        client_ws: WebSocket connection to frontend
        connection_id: Unique connection identifier
    """
    try:
        async for message in elevenlabs_ws:
            # Check if client is still connected
            if client_ws.client_state != WebSocketState.CONNECTED:
                logger.info(f"📴 Client no longer connected: {connection_id}")
                break
            
            # Forward to client
            if isinstance(message, str):
                # Text message (JSON)
                message_data = json.loads(message)
                
                # Check if this is an audio response
                if "audio_event" in message_data and "audio_base_64" in message_data["audio_event"]:
                    # Decode base64 audio and send as binary
                    audio_bytes = base64.b64decode(message_data["audio_event"]["audio_base_64"])
                    await client_ws.send_bytes(audio_bytes)
                    logger.info(f"🔊 Forwarded audio to client: {connection_id} ({len(audio_bytes)} bytes)")
                else:
                    # Regular text message (transcripts, status, etc.)
                    await client_ws.send_text(message)
                    logger.debug(f"← Forwarded text to client: {connection_id}")
                
                # Track characters (for cost calculation)
                if connection_id in active_connections:
                    if "text" in message_data:
                        active_connections[connection_id]["characters_used"] += len(message_data["text"])
                    # Also track agent responses
                    if "agent_response_event" in message_data and "response" in message_data["agent_response_event"]:
                        active_connections[connection_id]["characters_used"] += len(message_data["agent_response_event"]["response"])
            
            elif isinstance(message, bytes):
                # Binary message (audio) - unlikely with ElevenLabs Conversational AI
                await client_ws.send_bytes(message)
                logger.debug(f"← Forwarded binary audio to client: {connection_id}")
    
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"📴 ElevenLabs connection closed: {connection_id}")
    
    except Exception as e:
        logger.error(f"❌ Error forwarding to client for {connection_id}: {str(e)}")


@router.get("/health")
async def voice_health():
    """
    Health check for voice service.
    
    Returns:
        Status and active connection count
    """
    try:
        # Test ElevenLabs connection
        is_connected = await elevenlabs_service.validate_connection()
        
        return {
            "status": "healthy" if is_connected else "degraded",
            "service": "voice",
            "elevenlabs_configured": bool(elevenlabs_service.api_key and elevenlabs_service.agent_id),
            "elevenlabs_reachable": is_connected,
            "active_connections": len(active_connections),
            "connections": [
                {
                    "id": conn_id,
                    "client_ip": info["client_ip"],
                    "duration_seconds": (datetime.now() - info["connected_at"]).seconds,
                    "characters_used": info["characters_used"]
                }
                for conn_id, info in active_connections.items()
            ]
        }
    
    except Exception as e:
        logger.error(f"❌ Voice health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail={"status": "unhealthy", "error": str(e)}
        )


@router.get("/stats")
async def voice_stats():
    """
    Get voice usage statistics.
    
    Returns overall usage metrics.
    """
    total_chars = sum(
        info["characters_used"]
        for info in active_connections.values()
    )
    
    total_cost = elevenlabs_service.calculate_cost(total_chars)
    total_minutes = elevenlabs_service.estimate_minutes_from_characters(total_chars)
    
    return {
        "active_connections": len(active_connections),
        "total_characters": total_chars,
        "estimated_minutes": round(total_minutes, 2),
        "estimated_cost_usd": round(total_cost, 4)
    }

