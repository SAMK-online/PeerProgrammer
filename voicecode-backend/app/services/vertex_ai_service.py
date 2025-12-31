"""
Vertex AI Service - Google Gemini Integration

This service handles all communication with Google's Vertex AI (Gemini).

Why Vertex AI instead of Gemini API directly?
- Vertex AI is GCP-native (better integration)
- Same pricing as Gemini API
- Built-in monitoring and logging
- Enterprise features available
"""

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from app.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class VertexAIService:
    """
    Wrapper for Google Gemini API via Vertex AI.
    
    Responsibilities:
    - Configure Gemini model
    - Generate responses with proper context
    - Handle errors gracefully
    - Track token usage
    """
    
    def __init__(self):
        """
        Initialize the Gemini model.
        
        This happens once when the application starts (not per request).
        """
        try:
            # Configure API key
            # In production, this comes from Secret Manager
            # For now, from .env file
            genai.configure(api_key=settings.GEMINI_API_KEY)
            
            # Initialize model
            # gemini-2.5-flash: Best price-performance, free tier available
            # gemini-2.5-pro: More capable but requires paid plan
            self.model = genai.GenerativeModel(
                model_name='gemini-2.5-flash',
                generation_config={
                    'temperature': 0.7,      # Creativity (0=deterministic, 1=creative)
                    'top_p': 0.8,            # Nucleus sampling
                    'top_k': 40,             # Top-k sampling
                    'max_output_tokens': 500, # Limit response length
                },
                safety_settings={
                    # Relax safety filters for educational content
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            logger.info("✅ Vertex AI (Gemini) service initialized")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vertex AI service: {str(e)}")
            raise
    
    
    def build_context(
        self,
        user_message: str,
        code: Optional[str] = None,
        problem_id: Optional[str] = None,
        hint_level: int = 0
    ) -> str:
        """
        Build a rich context for the AI.
        
        Why context matters:
        - Generic response: "Use a hash map"
        - Contextual response: "I see you're using nested loops in line 3. 
          Consider: what data structure offers O(1) lookup?"
        
        Args:
            user_message: The user's question
            code: Their current code (if any)
            problem_id: The problem they're working on
            hint_level: How many hints they've seen (0-3)
        
        Returns:
            Formatted context string for Gemini
        """
        
        # Start with system instruction (defines mentor personality)
        context = """You are a Socratic coding mentor helping students learn data structures and algorithms.

CRITICAL RULES:
1. NEVER give complete solutions or full code
2. Guide with questions, not answers
3. Reference specific parts of their code when relevant
4. Keep responses concise (2-3 sentences)
5. Encourage thinking about time/space complexity

Teaching style: Socratic method
- Ask probing questions
- Build on student's existing knowledge
- Let them discover the solution

"""
        
        # Add problem context if available
        if problem_id:
            context += f"\nStudent is working on: {problem_id}\n"
        
        # Add code context if available
        if code:
            context += f"\nStudent's current code:\n```\n{code}\n```\n"
        
        # Add hint level context
        if hint_level > 0:
            context += f"\nHints already given: {hint_level}/3\n"
            context += "Build on previous hints. Don't repeat what they already know.\n"
        
        # Add the actual user question
        context += f"\nStudent's question: {user_message}\n"
        
        # Final reminder
        context += "\nRespond as a Socratic mentor. Guide, don't solve."
        
        return context
    
    
    async def generate_response(
        self,
        user_message: str,
        code: Optional[str] = None,
        problem_id: Optional[str] = None,
        hint_level: int = 0
    ) -> dict:
        """
        Generate an AI response with full context.
        
        This is the main method called by the chat router.
        
        Args:
            user_message: User's question
            code: Their current code
            problem_id: Problem they're working on
            hint_level: Hint level (0-3)
        
        Returns:
            {
                "response": "AI's answer",
                "tokens_used": 150,
                "model": "gemini-pro"
            }
        
        Raises:
            Exception: If API call fails
        """
        
        try:
            # Build rich context
            context = self.build_context(
                user_message=user_message,
                code=code,
                problem_id=problem_id,
                hint_level=hint_level
            )
            
            logger.debug(f"Sending to Gemini (context length: {len(context)} chars)")
            
            # Call Gemini API
            response = self.model.generate_content(context)
            
            # Extract response text
            response_text = response.text
            
            # Count tokens (approximate)
            # Gemini API doesn't return exact count, so we estimate
            # Average: 1 token ≈ 4 characters
            tokens_used = len(context + response_text) // 4
            
            logger.info(f"✅ Gemini response generated (~{tokens_used} tokens)")
            
            return {
                "response": response_text,
                "tokens_used": tokens_used,
                "model": "gemini-2.5-flash"
            }
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {str(e)}")
            
            # Return user-friendly error
            raise Exception(
                "I'm having trouble connecting to the AI service. "
                "Please try again in a moment."
            )
    
    
    def validate_response(self, response_text: str) -> bool:
        """
        Check if the AI response is appropriate.
        
        Sometimes Gemini gives full code despite instructions.
        This catches those cases.
        
        Args:
            response_text: The AI's response
        
        Returns:
            True if response is appropriate, False if it contains full code
        """
        
        # Check for code blocks (might be full solution)
        if "```python" in response_text or "```javascript" in response_text:
            # Count lines of code
            code_lines = response_text.count('\n')
            if code_lines > 5:
                logger.warning("⚠️ AI response contains too much code, filtering")
                return False
        
        # Check for common "giving away the answer" phrases
        giveaway_phrases = [
            "here's the complete solution",
            "here's the full code",
            "copy this code",
            "the answer is",
        ]
        
        for phrase in giveaway_phrases:
            if phrase in response_text.lower():
                logger.warning(f"⚠️ AI response contains giveaway phrase: {phrase}")
                return False
        
        return True


# Create singleton instance
# This is initialized once when the app starts
vertex_ai_service = VertexAIService()

