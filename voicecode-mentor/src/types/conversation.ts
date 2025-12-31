export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  messages: Message[];
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

