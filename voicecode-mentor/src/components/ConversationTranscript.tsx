import { useEffect, useRef, useState } from 'react';
import { User, Bot, Copy, Send, Loader } from 'lucide-react';
import type { Message } from '../types/conversation';

interface ConversationTranscriptProps {
  messages: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ConversationTranscript: React.FC<ConversationTranscriptProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !onSendMessage || isLoading) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    
    try {
      await onSendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-900">Conversation</h3>
        {messages.length > 0 && (
          <span className="text-xs text-zinc-500">{messages.length} messages</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <Bot size={32} className="text-zinc-600" />
            <p className="text-sm text-zinc-500">
              Start a voice session or type a message to begin
            </p>
            <p className="text-xs text-zinc-500">
              Your mentor has full context of your code and problem
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-zinc-900'
                    : 'bg-zinc-200'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-zinc-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-zinc-900">
                      {message.role === 'user' ? 'You' : 'AI Mentor'}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-zinc-100 border border-zinc-200'
                      : 'bg-white border border-zinc-200'
                  }`}>
                    <p className="text-sm text-zinc-900 whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="mt-1 text-xs text-zinc-500 hover:text-zinc-600 flex items-center gap-1 transition-colors"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      {onSendMessage && (
        <div className="flex-shrink-0 p-3 border-t border-zinc-200 bg-zinc-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (AI can see your code)"
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span className="text-sm">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            💡 The AI can see your current code, problem, and hint level
          </p>
        </div>
      )}
    </div>
  );
};

