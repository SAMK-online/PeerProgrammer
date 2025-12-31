import type { Problem } from '../types/problem';
import { getSessionId } from './contextSync';

// Backend API configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

interface ChatRequest {
  message: string;
  code?: string;
  problem_id?: string;
  language: string;
  hint_level: number;
}

interface ChatResponse {
  response: string;
  tokens_used: number;
  model: string;
}

export const initializeChatService = () => {
  // No initialization needed - backend handles everything
  return true;
};

export const startChatSession = (
  _problem: Problem | null,
  _currentCode: string,
  _hintLevel: number
) => {
  // Stateless - no session to start
  return true;
};

export const sendChatMessage = async (
  userMessage: string,
  problem: Problem | null,
  currentCode: string,
  hintLevel: number
): Promise<string> => {
  try {
    const requestBody: ChatRequest = {
      message: userMessage,
      code: currentCode || undefined,
      problem_id: problem?.id || undefined,
      language: 'python', // TODO: Get from UI language selector
      hint_level: hintLevel,
    };

    console.log('📤 Sending chat request to backend:', {
      message: userMessage.substring(0, 50) + '...',
      problem: problem?.title,
      codeLength: currentCode?.length || 0,
      hintLevel,
    });

    const sessionId = getSessionId();
    
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId || '',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      const errorMessage = errorData.detail?.message || errorData.detail || 'Failed to get response from AI';
      throw new Error(errorMessage);
    }

    const data: ChatResponse = await response.json();
    
    console.log('📥 Received chat response:', {
      model: data.model,
      tokens: data.tokens_used,
      responseLength: data.response.length,
    });

    return data.response;
  } catch (error) {
    console.error('❌ Error sending chat message:', error);
    if (error instanceof Error) {
      throw new Error(`Chat error: ${error.message}`);
    }
    throw new Error('Failed to communicate with AI mentor. Please check your connection.');
  }
};

export const resetChatSession = () => {
  // Stateless - nothing to reset
  console.log('💬 Chat session reset (stateless backend)');
};

// Update chat context when code changes significantly
export const updateChatContext = (
  _problem: Problem | null,
  _currentCode: string,
  _hintLevel: number
) => {
  // Stateless - context is sent with each request
  console.log('📝 Chat context updated (will be sent with next message)');
};

