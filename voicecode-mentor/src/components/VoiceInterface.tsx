import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { VoiceConnection, type VoiceStatus, type VoiceMessage } from '../services/voiceService';
import { addConversationMessage, forceSync } from '../services/contextSync';

interface VoiceInterfaceProps {
  problemTitle: string;
  problemId: string | null;
  hintLevel: number;
  currentCode: string;
  language: string;
  onTranscriptUpdate: (userText: string, aiText: string) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  problemId,
  problemTitle,
  hintLevel,
  currentCode,
  language,
  onTranscriptUpdate,
}) => {
  const [status, setStatus] = useState<VoiceStatus>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceConnection = useRef<VoiceConnection | null>(null);
  
  // Store callback in ref to avoid re-creating connection on every render
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
  
  // Update ref when callback changes (but don't recreate connection)
  useEffect(() => {
    onTranscriptUpdateRef.current = onTranscriptUpdate;
  }, [onTranscriptUpdate]);

  // Initialize voice connection ONCE (empty dependency array)
  useEffect(() => {
    console.log('🎤 Initializing persistent voice connection...');
    
    voiceConnection.current = new VoiceConnection(
      (newStatus) => {
        console.log(`🎤 Voice status: ${newStatus}`);
        setStatus(newStatus);
      },
      (message: VoiceMessage) => {
        console.log('📨 Voice message:', message);

        // Handle user transcripts (both old and new ElevenLabs format)
        const userText = message.user_transcript || message.user_transcription_event?.user_transcript;
        if (userText) {
          onTranscriptUpdateRef.current(userText, ''); // Use ref instead of prop

          // Store user message for conversation continuity (async, fire-and-forget)
          addConversationMessage('user', userText);
        }

        // Handle agent responses (both old and new ElevenLabs format)
        const aiText = message.agent_response || message.agent_response_event?.response;
        if (aiText) {
          onTranscriptUpdateRef.current('', aiText); // Use ref instead of prop
          setIsSpeaking(false);

          // Store AI response for conversation continuity (async, fire-and-forget)
          addConversationMessage('assistant', aiText);
        }

        // Handle status updates
        if (message.type === 'status' && message.content === 'speaking') {
          setIsSpeaking(true);
        }
      },
      (error) => {
        console.error('❌ Voice error:', error);
        alert(`Voice error: ${error}`);
      }
    );

    return () => {
      console.log('🎤 Cleaning up voice connection on unmount');
      if (voiceConnection.current) {
        voiceConnection.current.disconnect();
      }
    };
  }, []); // Empty array = only run once on mount

  const startConversation = async () => {
    if (!voiceConnection.current) {
      alert('Voice service not initialized');
      return;
    }

    try {
      // 🎯 CRITICAL: Force sync context BEFORE connecting to voice
      // This ensures the session exists with current code/problem data
      console.log('⚡ Force syncing context before voice connection...');
      const synced = await forceSync({
        code: currentCode,
        problemId: problemId,
        problemTitle: problemTitle,
        hintLevel: hintLevel,
        language: language,
      });

      if (!synced) {
        console.warn('⚠️  Context sync failed, but continuing with voice connection');
      }

      // Small delay to ensure backend has processed the sync
      await new Promise(resolve => setTimeout(resolve, 200));

      await voiceConnection.current.connect();
      console.log('✅ Voice conversation started (context auto-injected by backend)');
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start voice conversation. Check the console for details.');
    }
  };

  const stopConversation = () => {
    if (voiceConnection.current) {
      voiceConnection.current.disconnect();
    }
  };

  // Note: Context is now auto-synced by the backend
  // The refreshContext button was removed since the backend handles this
  // via the session system and automatic context sync every 5 seconds


  return (
    <div className="flex items-center gap-3">      
      <div className="flex items-center gap-2">
        {status === 'connected' ? (
          <>
            <div className="flex items-center gap-2 text-sm text-green-700">
              {isSpeaking ? (
                <>
                  <Volume2 size={16} className="animate-pulse" />
                  <span className="font-medium">AI Speaking...</span>
                </>
              ) : (
                <>
                  <Mic size={16} className="animate-pulse" />
                  <span className="font-medium">Listening...</span>
                </>
              )}
            </div>
            <button
              onClick={stopConversation}
              className="flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-sm rounded transition-colors"
            >
              <MicOff size={16} />
              End Session
            </button>
          </>
        ) : (
          <button
            onClick={startConversation}
            disabled={status === 'connecting'}
            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50 hover:bg-white disabled:bg-zinc-300 disabled:cursor-not-allowed text-zinc-900 text-sm rounded transition-colors"
          >
            <Mic size={16} />
            {status === 'connecting' ? 'Connecting...' : 'Start Voice Session'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'connecting' ? 'bg-yellow-500' :
          status === 'error' ? 'bg-red-500' :
          'bg-zinc-300'
        }`} />
        <span className="capitalize">{status}</span>
      </div>
      
      {status === 'connected' && (
        <>
          <div className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200">
            ✨ Context synced
          </div>
          <div className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded border border-zinc-200">
            🔒 Persistent session
          </div>
        </>
      )}
    </div>
  );
};

