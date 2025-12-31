import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-y-auto relative">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none" />
      
      {/* Animated background dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-400/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 z-50 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}>
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <span className="text-xl font-medium tracking-tight hover:text-zinc-600 transition-colors cursor-pointer">
            CodeE AI
          </span>
          
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/yourusername/codee-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-all hover:translate-x-0.5"
            >
              GitHub ↗
            </a>
            <button
              onClick={onGetStarted}
              className="text-sm px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md transition-all hover:shadow-lg hover:scale-105"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {/* Badge */}
            <p className={`text-sm text-zinc-500 transition-all duration-700 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Built for AI Partner Catalyst Hackathon ↘
            </p>

            {/* Main Headline */}
            <h1 className={`text-7xl sm:text-8xl font-light leading-[1.1] tracking-tight transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              The voice layer for
              <br />
              <span className="font-medium italic bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent animate-gradient">
                peer programming
              </span>
            </h1>

            {/* Subheadline */}
            <div className={`max-w-2xl space-y-6 transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <p className="text-xl text-zinc-700 leading-relaxed hover:text-zinc-900 transition-colors">
                CodeE AI is a <span className="font-medium text-zinc-900">voice-first peer programming companion</span> that 
                bridges humans and AI-powered coding tools through natural conversation.
              </p>
              
              <p className="text-xl text-zinc-700 leading-relaxed">
                This first iteration focuses on <span className="font-medium text-zinc-900 relative inline-block group">
                  efficient DSA learning
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </span> 
                —helping you master data structures and algorithms through real-time voice guidance. 
                The future? Full integration with IDEs like Cursor and Windsurf, bringing voice-powered pair programming to your entire codebase.
              </p>
            </div>

            {/* CTA */}
            <div className={`flex items-center gap-6 transition-all duration-700 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <button
                onClick={onGetStarted}
                className="group px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm rounded-md transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                Launch CodeE AI
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="https://github.com/yourusername/codee-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-all hover:translate-x-0.5"
              >
                View on GitHub ↗
              </a>
            </div>

            {/* Powered By Logos */}
            <div className={`flex items-center gap-6 pt-8 transition-all duration-700 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <span className="text-sm text-zinc-400 uppercase tracking-wider">Powered by</span>
              
              <div className="flex items-center gap-6">
                {/* ElevenLabs Logo */}
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-white border border-zinc-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <img 
                    src="/elevenlabs-logo.png" 
                    alt="ElevenLabs" 
                    className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-base font-medium text-zinc-700 group-hover:text-purple-600 transition-colors">
                    ElevenLabs
                  </span>
                </a>

                {/* Google Gemini Logo */}
                <a
                  href="https://deepmind.google/technologies/gemini/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-white border border-zinc-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <img 
                    src="/gemini-logo.webp" 
                    alt="Google Gemini" 
                    className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-base font-medium text-zinc-700 group-hover:text-blue-600 transition-colors">
                    Google Gemini
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-20 px-8 border-t border-zinc-200 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            The Vision
            <span className="text-zinc-300">—</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="space-y-12 text-lg text-zinc-700 leading-relaxed">
            <p className="hover:text-zinc-900 transition-colors">
              CodeE AI is built on a bold idea: <span className="font-medium text-zinc-900">voice should be the primary 
              interface between humans and AI-powered coding tools.</span> While AI assistants have revolutionized 
              how we write code, they still require typing—breaking flow and slowing thinking.
            </p>
            
            <p className="text-zinc-900 font-medium text-xl border-l-2 border-zinc-900 pl-6 py-2">
              We're building the voice layer for peer programming.
            </p>
            
            <p className="hover:text-zinc-900 transition-colors">
              <span className="font-medium text-zinc-900">This first iteration</span> focuses on what we do best: 
              helping developers master data structures and algorithms through efficient, voice-driven pair programming. 
              Using ElevenLabs' conversational AI and Google Cloud Vertex AI (Gemini), we've created a mentor that 
              sees your code in real-time and guides you with Socratic questions—not answers.
            </p>
            
            <p className="hover:text-zinc-900 transition-colors">
              The system maintains persistent voice sessions, remembers your conversation history, and stays connected 
              while you code—delivering a true peer programming experience. You can think out loud, debug interactively, 
              and learn faster without breaking your flow to type questions.
            </p>
            
            <p className="hover:text-zinc-900 transition-colors">
              <span className="font-medium text-zinc-900">The future is integration.</span> Imagine CodeE AI running 
              locally in platforms like Cursor or Windsurf, with access to your entire indexed codebase. Voice-powered 
              pair programming across full-stack applications, not just algorithm practice. Context-aware guidance for 
              debugging, refactoring, and system design—all through natural conversation.
            </p>
            
            <p className="hover:text-zinc-900 transition-colors">
              Today, we're proving the model works for DSA learning. Tomorrow, we're bringing voice-first development 
              to every IDE and every developer.
            </p>
            
            <p className="text-sm text-zinc-500 italic pt-8">
              CodeE AI Team
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="py-20 px-8 border-t border-zinc-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            Architecture
            <span className="text-zinc-300">—</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-16" />
          
          {/* Architecture Diagram */}
          <div className="relative bg-white border border-zinc-200 rounded-xl p-12 shadow-sm">
            {/* Grid pattern background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
            
            <div className="relative">
              {/* Top Row: Frontend */}
              <div className="flex justify-center mb-8">
                <div className="group relative">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Frontend</div>
                    <div className="font-medium text-lg">React + TypeScript</div>
                    <div className="text-xs mt-2 space-y-1 opacity-90">
                      <div>• Monaco Editor</div>
                      <div>• Pyodide (Python)</div>
                      <div>• WebSocket Audio</div>
                    </div>
                  </div>
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </div>
              
              {/* Arrow down with label */}
              <div className="flex flex-col items-center mb-8">
                <div className="text-xs text-zinc-500 mb-2 bg-white px-3 py-1 rounded-full border border-zinc-200">
                  Context Sync (5s) + Voice WebSocket
                </div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-blue-400 via-purple-400 to-purple-500 animate-pulse" />
                <div className="text-purple-500 text-xl">↓</div>
              </div>
              
              {/* Middle Row: Backend */}
              <div className="flex justify-center mb-8">
                <div className="group relative">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Backend</div>
                    <div className="font-medium text-lg">FastAPI (Python)</div>
                    <div className="text-xs mt-2 space-y-1 opacity-90">
                      <div>• Voice Proxy</div>
                      <div>• Session Manager</div>
                      <div>• Context Injection</div>
                    </div>
                  </div>
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </div>
              
              {/* Arrow split */}
              <div className="flex justify-center mb-8">
                <div className="text-purple-500 text-xl">↓</div>
              </div>
              <div className="flex justify-center items-start gap-4 mb-8">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-purple-400 to-pink-500 animate-pulse" />
                  <div className="text-pink-500 text-xl">↓</div>
                </div>
                <div className="flex-1" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-purple-400 to-cyan-500 animate-pulse" />
                  <div className="text-cyan-500 text-xl">↓</div>
                </div>
              </div>
              
              {/* Bottom Row: AI Services */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* ElevenLabs */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Voice AI</div>
                    <div className="font-medium text-lg">ElevenLabs</div>
                    <div className="text-xs mt-2 space-y-1 opacity-90">
                      <div>• Conversational Agent</div>
                      <div>• Real-time Audio</div>
                      <div>• Context Aware</div>
                    </div>
                  </div>
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  
                  {/* Label */}
                  <div className="absolute -top-6 left-0 right-0 text-center">
                    <span className="text-xs text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200">
                      Voice Mode
                    </span>
                  </div>
                </div>
                
                {/* Gemini */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Chat AI</div>
                    <div className="font-medium text-lg">Vertex AI</div>
                    <div className="text-xs mt-2 space-y-1 opacity-90">
                      <div>• Gemini 2.5 Flash</div>
                      <div>• Socratic Teaching</div>
                      <div>• Hint Generation</div>
                    </div>
                  </div>
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  
                  {/* Label */}
                  <div className="absolute -top-6 left-0 right-0 text-center">
                    <span className="text-xs text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200">
                      Chat Mode
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-12 pt-8 border-t border-zinc-200">
                <div className="grid md:grid-cols-3 gap-6 text-xs text-zinc-600">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-zinc-900 mb-1">Session State</div>
                      <div>Code, problem, hints synced every 5s</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-zinc-900 mb-1">Voice Proxy</div>
                      <div>Injects context before forwarding audio</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-zinc-900 mb-1">Dual Mode</div>
                      <div>Voice or text—same context, different UX</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Highlights */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-all">
              <h3 className="font-medium text-zinc-900 mb-2">🔄 Real-Time Sync</h3>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Frontend automatically syncs code, problem selection, and conversation history to the backend every 5 seconds using REST API.
              </p>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-all">
              <h3 className="font-medium text-zinc-900 mb-2">🎤 Voice Proxy</h3>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Backend WebSocket proxies audio to ElevenLabs, injecting context on connection so the AI sees your code automatically.
              </p>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-all">
              <h3 className="font-medium text-zinc-900 mb-2">⚡ Client-Side Execution</h3>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Pyodide runs Python in-browser via WebAssembly—zero server lag for test execution, instant feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-8 border-t border-zinc-200 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            How It Works
            <span className="text-zinc-300">—</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 group hover:bg-white p-6 rounded-lg transition-all border border-transparent hover:border-zinc-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="font-medium text-zinc-900 text-lg">Real-Time Context Sync</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Every 5 seconds, your code, problem selection, and conversation history are synchronized 
                with our backend. The AI always knows exactly what you're working on.
              </p>
            </div>
            
            <div className="space-y-4 group hover:bg-white p-6 rounded-lg transition-all border border-transparent hover:border-zinc-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-medium group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="font-medium text-zinc-900 text-lg">Voice Proxy Architecture</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                When you start a voice session, we inject your current code and problem context directly 
                into the ElevenLabs agent. Your mentor can see and reference your actual code.
              </p>
            </div>
            
            <div className="space-y-4 group hover:bg-white p-6 rounded-lg transition-all border border-transparent hover:border-zinc-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-medium group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="font-medium text-zinc-900 text-lg">Persistent Sessions</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Voice connections stay active while you code, run tests, and iterate. No interruptions, 
                no reconnects—just continuous pair programming like working with a human partner.
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-gradient-to-br from-zinc-50 to-white border border-zinc-200 rounded-lg">
            <p className="text-sm text-zinc-700 leading-relaxed">
              <span className="font-medium text-zinc-900">Why This Matters:</span> Traditional AI coding assistants 
              require you to copy-paste code, explain context, and break your flow. CodeE AI sees what you're doing 
              automatically—making voice interaction as seamless as talking to a teammate sitting next to you.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-8 border-t border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            Technology
            <span className="text-zinc-300">—</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="grid md:grid-cols-2 gap-16 text-sm text-zinc-700">
            <div className="space-y-3 group">
              <h3 className="font-medium text-zinc-900 mb-4 transition-all group-hover:text-purple-700 flex items-center gap-2">
                ElevenLabs
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Conversational AI Agents</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Real-time Audio Streaming</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Natural Voice Synthesis</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">WebSocket Integration</p>
            </div>
            
            <div className="space-y-3 group">
              <h3 className="font-medium text-zinc-900 mb-4 transition-all group-hover:text-blue-700 flex items-center gap-2">
                Google Cloud
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Vertex AI (Gemini 2.5 Flash)</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Cloud Run Deployment</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Session Management</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Real-time Context Sync</p>
            </div>

            <div className="space-y-3 group">
              <h3 className="font-medium text-zinc-900 mb-4 transition-all group-hover:text-cyan-700 flex items-center gap-2">
                Frontend
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">React + TypeScript</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Monaco Editor</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Pyodide (Python in Browser)</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">WebSocket Audio Streaming</p>
            </div>

            <div className="space-y-3 group">
              <h3 className="font-medium text-zinc-900 mb-4 transition-all group-hover:text-green-700 flex items-center gap-2">
                Backend
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Python FastAPI</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Voice Proxy Architecture</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Conversation History</p>
              <p className="hover:text-zinc-900 hover:translate-x-1 transition-all cursor-default">Context-Aware Sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-8 border-t border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            Demo
            <span className="text-zinc-300">—</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="aspect-video bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-lg flex items-center justify-center relative overflow-hidden group border border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={32} className="text-white" />
              </div>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-700 transition-colors">
                3-minute demo video (coming soon)
              </p>
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 mt-6 hover:text-zinc-700 transition-colors">
            A walkthrough of voice conversation, code execution, and Socratic teaching in action.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 border-t border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            Current Features
            <span className="text-zinc-300">—</span>
            <span className="text-xs text-zinc-400 font-normal">v1.0 (DSA Focus)</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="grid md:grid-cols-3 gap-8 text-sm text-zinc-700">
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-blue-700 transition-colors">Voice-First Interface</h3>
              <p className="group-hover:text-zinc-900 transition-colors">Natural conversation as your primary coding interface</p>
            </div>
            
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Real-Time Code Context</h3>
              <p className="group-hover:text-zinc-900 transition-colors">AI sees your code automatically—no copy-pasting</p>
            </div>
            
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-green-700 transition-colors">Persistent Sessions</h3>
              <p className="group-hover:text-zinc-900 transition-colors">Voice stays connected while you code and test</p>
            </div>
            
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-cyan-700 transition-colors">75+ DSA Problems</h3>
              <p className="group-hover:text-zinc-900 transition-colors">Complete Blind 75 problem set for interview prep</p>
            </div>
            
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-orange-700 transition-colors">Socratic Teaching</h3>
              <p className="group-hover:text-zinc-900 transition-colors">Guided questions, not answers—learn by doing</p>
            </div>
            
            <div className="group hover:bg-zinc-50 p-4 rounded-lg transition-all hover:shadow-sm cursor-default border border-transparent hover:border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-2 group-hover:text-pink-700 transition-colors">Instant Python Execution</h3>
              <p className="group-hover:text-zinc-900 transition-colors">Run code in-browser via Pyodide—no server lag</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Roadmap Section */}
      <section className="py-20 px-8 border-t border-zinc-200 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-medium mb-12 flex items-center gap-3">
            Future Vision
            <span className="text-zinc-300">—</span>
            <span className="text-xs text-zinc-400 font-normal">Beyond DSA</span>
          </h2>
          
          <div className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 mb-12" />
          
          <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-700">
            <div className="group hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 p-6 rounded-lg transition-all border border-zinc-200 hover:border-blue-300 hover:shadow-md">
              <h3 className="font-medium text-zinc-900 mb-3 text-base group-hover:text-blue-700 transition-colors">IDE Integration</h3>
              <p className="group-hover:text-zinc-900 transition-colors leading-relaxed">
                Native plugins for Cursor, Windsurf, and VS Code. Voice-powered pair programming with 
                full access to your indexed codebase—from single functions to entire microservices.
              </p>
            </div>
            
            <div className="group hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 p-6 rounded-lg transition-all border border-zinc-200 hover:border-purple-300 hover:shadow-md">
              <h3 className="font-medium text-zinc-900 mb-3 text-base group-hover:text-purple-700 transition-colors">Multi-Language Support</h3>
              <p className="group-hover:text-zinc-900 transition-colors leading-relaxed">
                Expand beyond Python to JavaScript, TypeScript, Rust, Go, and more. Voice-first debugging, 
                refactoring, and system design across your entire tech stack.
              </p>
            </div>
            
            <div className="group hover:bg-gradient-to-br hover:from-pink-50 hover:to-orange-50 p-6 rounded-lg transition-all border border-zinc-200 hover:border-pink-300 hover:shadow-md">
              <h3 className="font-medium text-zinc-900 mb-3 text-base group-hover:text-pink-700 transition-colors">Collaborative Sessions</h3>
              <p className="group-hover:text-zinc-900 transition-colors leading-relaxed">
                Multi-user voice sessions where teams can pair program together with AI assistance. 
                Perfect for code reviews, onboarding, and distributed team collaboration.
              </p>
            </div>
            
            <div className="group hover:bg-gradient-to-br hover:from-orange-50 hover:to-yellow-50 p-6 rounded-lg transition-all border border-zinc-200 hover:border-orange-300 hover:shadow-md">
              <h3 className="font-medium text-zinc-900 mb-3 text-base group-hover:text-orange-700 transition-colors">Advanced Context</h3>
              <p className="group-hover:text-zinc-900 transition-colors leading-relaxed">
                Git history awareness, documentation integration, and dependency analysis. The AI understands 
                not just your code, but your project's architecture and evolution.
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-lg">
            <p className="text-sm leading-relaxed">
              <span className="font-medium">Our North Star:</span> Every developer should be able to think 
              and code at the speed of conversation. CodeE AI is the voice layer that makes this possible—starting 
              with DSA mastery, scaling to full-stack development.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-8 mt-20 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
        
        <div className="max-w-5xl mx-auto flex justify-between items-start text-sm text-zinc-600">
          <div className="hover:text-zinc-900 transition-colors">
            © CodeE AI 2025<br />
            Built for AI Partner Catalyst Hackathon
          </div>
          <div className="flex gap-8">
            <a 
              href="https://github.com/yourusername/codee-ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-all hover:translate-x-0.5"
            >
              GitHub ↗
            </a>
            <a 
              href="https://devpost.com/software/codee-ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-all hover:translate-x-0.5"
            >
              Devpost ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

