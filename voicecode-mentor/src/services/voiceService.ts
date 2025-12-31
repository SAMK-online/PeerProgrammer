/**
 * Voice Service - Context-Aware WebSocket Connection with Audio Streaming
 * 
 * Connects to our backend voice proxy (not directly to ElevenLabs).
 * This gives us full control over context injection and message handling.
 */

import { getSessionId } from './contextSync';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const WS_URL = BACKEND_URL.replace('http://', 'ws://').replace('https://', 'wss://');

export type VoiceStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface VoiceMessage {
  type: string;
  content?: string;
  user_transcript?: string;
  agent_response?: string;
  message?: string;
  // New ElevenLabs format
  user_transcription_event?: {
    user_transcript: string;
  };
  agent_response_event?: {
    response: string;
  };
}

export class VoiceConnection {
  private ws: WebSocket | null = null;
  private status: VoiceStatus = 'disconnected';
  private onStatusChange: (status: VoiceStatus) => void;
  private onMessage: (message: VoiceMessage) => void;
  private onError: (error: string) => void;
  private audioContext: AudioContext | null = null;
  private playbackContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlayingAudio = false;
  private audioProcessor: ScriptProcessorNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private nextPlayTime = 0;

  constructor(
    onStatusChange: (status: VoiceStatus) => void,
    onMessage: (message: VoiceMessage) => void,
    onError: (error: string) => void
  ) {
    this.onStatusChange = onStatusChange;
    this.onMessage = onMessage;
    this.onError = onError;
  }

  async connect(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('⚠️  Already connected to voice service');
      return;
    }

    const sessionId = getSessionId();
    const wsUrl = sessionId 
      ? `${WS_URL}/api/voice/stream?session_id=${sessionId}`
      : `${WS_URL}/api/voice/stream`;

    console.log(`🔗 Connecting to voice proxy: ${wsUrl}`);
    this.updateStatus('connecting');

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone access granted');

      // Initialize AudioContext for playback (persistent)
      this.playbackContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.nextPlayTime = this.playbackContext.currentTime;

      // Initialize WebSocket
      this.ws = new WebSocket(wsUrl);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('✅ Connected to backend voice proxy');
        this.updateStatus('connected');
        this.startAudioCapture(stream);
      };

      this.ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          // Handle JSON messages (transcripts, status, etc.)
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Voice message:', data);
            this.onMessage(data);
          } catch (error) {
            console.error('Failed to parse voice message:', error);
          }
        } else if (event.data instanceof ArrayBuffer) {
          // Handle binary audio data
          console.log('🔊 Received audio chunk:', event.data.byteLength, 'bytes');

          // Debug: Log first chunk details to verify sample rate
          if (this.audioQueue.length === 0) {
            const pcmData = new Int16Array(event.data);
            console.log('📊 First audio chunk - samples:', pcmData.length, 'bytes:', event.data.byteLength);
          }

          this.audioQueue.push(event.data);
          if (!this.isPlayingAudio) {
            this.playAudioQueue();
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.updateStatus('error');
        this.onError('Voice connection error');
      };

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from voice service');
        this.stopAudioCapture();
        this.updateStatus('disconnected');
      };
    } catch (error: any) {
      console.error('Failed to connect to voice service:', error);
      this.updateStatus('error');
      this.onError(error.message || 'Failed to connect to voice service. Please check microphone permissions.');
    }
  }

  private startAudioCapture(stream: MediaStream): void {
    try {
      this.mediaStream = stream;
      
      // Create AudioContext for processing (16kHz for ElevenLabs)
      const captureAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.audioSource = captureAudioCtx.createMediaStreamSource(stream);
      
      // Create ScriptProcessorNode for raw PCM audio
      this.audioProcessor = captureAudioCtx.createScriptProcessor(2048, 1, 1);
      
      this.audioProcessor.onaudioprocess = (e) => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          
          // Convert Float32Array to Int16Array (PCM 16-bit)
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          
          // Send as ArrayBuffer
          this.ws.send(pcmData.buffer);
          console.log('🎤 Sent PCM audio chunk:', pcmData.buffer.byteLength, 'bytes');
        }
      };
      
      this.audioSource.connect(this.audioProcessor);
      this.audioProcessor.connect(captureAudioCtx.destination);
      
      console.log('🎤 Audio capture started (PCM 16-bit, 16kHz)');
    } catch (error) {
      console.error('Failed to start audio capture:', error);
      this.onError('Failed to start microphone capture');
    }
  }

  private stopAudioCapture(): void {
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }
    
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    console.log('🎤 Audio capture stopped');
  }

  private async playAudioQueue(): Promise<void> {
    if (!this.playbackContext) {
      console.error('Playback context not initialized');
      return;
    }

    if (this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      return;
    }

    this.isPlayingAudio = true;

    while (this.audioQueue.length > 0) {
      const pcmBuffer = this.audioQueue.shift();
      if (pcmBuffer) {
        try {
          // ElevenLabs sends raw PCM: 16-bit signed, mono
          const pcmData = new Int16Array(pcmBuffer);

          // ElevenLabs Conversational AI uses 16kHz (not 22.05kHz)
          // If you hear squeaky/chipmunk voice, the sample rate is wrong
          const sampleRate = 16000;

          // Create AudioBuffer
          const audioBuffer = this.playbackContext.createBuffer(1, pcmData.length, sampleRate);
          const channelData = audioBuffer.getChannelData(0);

          // Convert Int16 to Float32 (Web Audio API format)
          for (let i = 0; i < pcmData.length; i++) {
            channelData[i] = pcmData[i] / 32768.0;
          }

          // Schedule playback at the right time for seamless audio
          const source = this.playbackContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.playbackContext.destination);

          // Calculate when to start this chunk
          const currentTime = this.playbackContext.currentTime;
          const startTime = Math.max(currentTime, this.nextPlayTime);

          // Schedule the audio to play
          source.start(startTime);

          // Update next play time (this chunk's start + duration)
          const duration = audioBuffer.duration;
          this.nextPlayTime = startTime + duration;

          console.log('🔊 Scheduled audio chunk:', pcmData.length, 'samples at', startTime.toFixed(3), 's');
        } catch (error) {
          console.error('Failed to play audio chunk:', error);
        }
      }
    }

    this.isPlayingAudio = false;
  }

  disconnect(): void {
    this.stopAudioCapture();

    if (this.ws) {
      console.log('🛑 Closing voice connection...');
      this.ws.close();
      this.ws = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.playbackContext) {
      this.playbackContext.close();
      this.playbackContext = null;
    }

    this.audioQueue = [];
    this.nextPlayTime = 0;
    this.updateStatus('disconnected');
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️  Cannot send: WebSocket not connected');
    }
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  private updateStatus(status: VoiceStatus): void {
    this.status = status;
    this.onStatusChange(status);
  }
}

