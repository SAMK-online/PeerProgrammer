// ElevenLabs service configuration
export const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || '',
};

export const validateElevenLabsConfig = (): boolean => {
  if (!ELEVENLABS_CONFIG.apiKey || ELEVENLABS_CONFIG.apiKey === 'your_elevenlabs_api_key_here') {
    console.error('ElevenLabs API key not configured');
    return false;
  }
  if (!ELEVENLABS_CONFIG.agentId || ELEVENLABS_CONFIG.agentId === 'your_agent_id_here') {
    console.error('ElevenLabs Agent ID not configured');
    return false;
  }
  return true;
};

