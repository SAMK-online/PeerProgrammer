import { create } from 'zustand';
import type { Problem } from '../types/problem';
import type { Message } from '../types/conversation';
import type { TestResult } from '../components/TestResults';

interface AppState {
  // Problem state
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem | null) => void;
  
  // Code state
  code: string;
  setCode: (code: string) => void;
  language: 'python' | 'javascript' | 'typescript';
  setLanguage: (language: 'python' | 'javascript' | 'typescript') => void;
  
  // Hint state
  hintLevel: 0 | 1 | 2 | 3;
  setHintLevel: (level: 0 | 1 | 2 | 3) => void;
  currentHint: string | null;
  setCurrentHint: (hint: string | null) => void;
  
  // Conversation state
  messages: Message[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  
  // Test results state
  testResults: TestResult[];
  setTestResults: (results: TestResult[]) => void;
  
  // Progress tracking
  problemsAttempted: Set<string>;
  problemsSolved: Set<string>;
  markProblemAttempted: (problemId: string) => void;
  markProblemSolved: (problemId: string) => void;
  
  // Session management
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Problem state
  currentProblem: null,
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  
  // Code state
  code: '',
  setCode: (code) => set({ code }),
  language: 'typescript',
  setLanguage: (language) => set({ language }),
  
  // Hint state
  hintLevel: 0,
  setHintLevel: (level) => set({ hintLevel: level }),
  currentHint: null,
  setCurrentHint: (hint) => set({ currentHint: hint }),
  
  // Conversation state
  messages: [],
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `${Date.now()}-${Math.random()}`,
          role,
          content,
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  
  // Test results state
  testResults: [],
  setTestResults: (results) => set({ testResults: results }),
  
  // Progress tracking
  problemsAttempted: new Set<string>(),
  problemsSolved: new Set<string>(),
  markProblemAttempted: (problemId) =>
    set((state) => ({
      problemsAttempted: new Set([...state.problemsAttempted, problemId]),
    })),
  markProblemSolved: (problemId) =>
    set((state) => ({
      problemsSolved: new Set([...state.problemsSolved, problemId]),
    })),
  
  // Session management
  resetSession: () =>
    set({
      code: '',
      hintLevel: 0,
      currentHint: null,
      messages: [],
      testResults: [],
    }),
}));

