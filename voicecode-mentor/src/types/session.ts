import type { Problem } from './problem';

export interface SessionState {
  currentProblem: Problem | null;
  code: string;
  language: 'python' | 'javascript' | 'typescript';
  hintLevel: 0 | 1 | 2 | 3;
  problemsAttempted: string[];
  problemsSolved: string[];
  startTime: Date | null;
}

