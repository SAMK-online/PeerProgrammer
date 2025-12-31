import { useState, useEffect } from 'react';
import { useAppStore } from './context/AppContext';
import { VoiceInterface } from './components/VoiceInterface';
import { ConversationTranscript } from './components/ConversationTranscript';
import { ProblemPanel } from './components/ProblemPanel';
import { CodeEditor } from './components/CodeEditor';
import { TestResults } from './components/TestResults';
import { ProblemSelector } from './components/ProblemSelector';
import { HintPanel } from './components/HintPanel';
import { LandingPage } from './pages/LandingPage';
import { requestHint } from './services/hintGenerator';
import { runTests } from './services/testRunner';
import { sendChatMessage, resetChatSession } from './services/chatService';
import { startContextSync, stopContextSync, clearSession } from './services/contextSync';
import { Code2, RefreshCw, MessageSquare, X, Home } from 'lucide-react';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const {
    currentProblem,
    setCurrentProblem,
    code,
    setCode,
    language,
    setLanguage,
    hintLevel,
    setHintLevel,
    currentHint,
    setCurrentHint,
    messages,
    addMessage,
    testResults,
    setTestResults,
    markProblemAttempted,
    resetSession,
  } = useAppStore();

  const [showProblemSelector, setShowProblemSelector] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);

  // Initialize with starter code when problem changes
  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.starterCode[language]);
      setHintLevel(0);
      setCurrentHint(null);
      setTestResults([]);
      markProblemAttempted(currentProblem.id);
    }
  }, [currentProblem, language]);

  // Start automatic context sync on mount
  useEffect(() => {
    console.log('🚀 Starting context sync service...');
    
    startContextSync(() => ({
      code,
      problemId: currentProblem?.id || null,
      problemTitle: currentProblem?.title || null,
      hintLevel,
      language,
    }));
    
    return () => {
      console.log('🛑 Stopping context sync service...');
      stopContextSync();
    };
  }, [code, currentProblem, hintLevel, language]);

  const handleTranscriptUpdate = (userText: string, aiText: string) => {
    if (userText) {
      addMessage('user', userText);
    }
    if (aiText) {
      addMessage('assistant', aiText);
    }
  };

  const handleRequestHint = async () => {
    const result = await requestHint(currentProblem, code, hintLevel);
    setHintLevel(result.newLevel as 0 | 1 | 2 | 3);
    setCurrentHint(result.hint);
  };

  const handleRunTests = async () => {
    if (!currentProblem) return;
    
    setIsRunningTests(true);
    try {
      const results = await runTests(code, currentProblem, language);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleLanguageChange = (newLanguage: 'python' | 'javascript' | 'typescript') => {
    if (currentProblem) {
      const confirmChange = window.confirm(
        'Changing language will reset your code to the starter template. Continue?'
      );
      if (confirmChange) {
        setLanguage(newLanguage);
        setCode(currentProblem.starterCode[newLanguage]);
      }
    } else {
      setLanguage(newLanguage);
    }
  };

  const handleResetSession = () => {
    const confirm = window.confirm('Reset your current session? This will clear your code and conversation.');
    if (confirm) {
      resetSession();
      resetChatSession();
      clearSession(); // Clear backend session
      if (currentProblem) {
        setCode(currentProblem.starterCode[language]);
      }
    }
  };

  const handleSendChatMessage = async (message: string) => {
    setIsChatLoading(true);
    
    // Add user message immediately
    addMessage('user', message);
    
    try {
      // Send message with full context
      const response = await sendChatMessage(
        message,
        currentProblem,
        code,
        hintLevel
      );
      
      // Add AI response
      addMessage('assistant', response);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Main app interface
  return (
    <div className="h-screen w-screen bg-white text-zinc-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-zinc-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-sm rounded transition-colors"
              title="Back to landing page"
            >
              <Home size={14} />
              Home
            </button>
            <span className="text-xs text-zinc-400">|</span>
            <h1 className="text-lg font-medium tracking-tight">
              CodeE AI
            </h1>
            <span className="text-xs text-zinc-400">|</span>
            <p className="text-sm text-zinc-500">Learn to Code By Talking</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as typeof language)}
              className="px-3 py-1.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 hover:border-zinc-400 transition-colors"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded transition-all ${
                showChat 
                  ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' 
                  : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
              }`}
              title={showChat ? 'Hide chat panel' : 'Show chat panel'}
            >
              {showChat ? <X size={14} /> : <MessageSquare size={14} />}
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>

            <button
              onClick={handleResetSession}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-sm rounded transition-colors"
            >
              <RefreshCw size={14} />
              Reset
            </button>

            <VoiceInterface
              problemTitle={currentProblem?.title || 'No problem selected'}
              problemId={currentProblem?.id || null}
              hintLevel={hintLevel}
              currentCode={code}
              language={language}
              onTranscriptUpdate={handleTranscriptUpdate}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem */}
        <div className="w-1/4 bg-zinc-50 border-r border-zinc-200 overflow-hidden">
          <ProblemPanel
            problem={currentProblem}
            hintLevel={hintLevel}
            onRequestHint={handleRequestHint}
            onSelectProblem={() => setShowProblemSelector(true)}
          />
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
          {currentHint && (
            <HintPanel
              hint={currentHint}
              hintLevel={hintLevel}
              onClose={() => setCurrentHint(null)}
            />
          )}
          
          <div className="flex-1 overflow-hidden">
            {currentProblem ? (
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-center p-6">
                <div className="space-y-3">
                  <Code2 size={48} className="text-zinc-300 mx-auto" />
                  <h2 className="text-xl font-medium text-zinc-900">No Problem Selected</h2>
                  <p className="text-sm text-zinc-500 max-w-md">
                    Select a problem from the left panel to start coding with voice-guided mentoring
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="h-48 flex-shrink-0 border-t border-zinc-200">
            <TestResults
              results={testResults}
              isRunning={isRunningTests}
              onRunTests={handleRunTests}
            />
          </div>
        </div>

        {/* Right Panel - Conversation */}
        {showChat && (
          <div className="w-1/3 bg-zinc-50 border-l border-zinc-200 overflow-hidden">
            <ConversationTranscript 
              messages={messages}
              onSendMessage={handleSendChatMessage}
              isLoading={isChatLoading}
            />
          </div>
        )}
      </div>

      {/* Problem Selector Modal */}
      {showProblemSelector && (
        <ProblemSelector
          onSelect={setCurrentProblem}
          onClose={() => setShowProblemSelector(false)}
        />
      )}
    </div>
  );
}

export default App;
