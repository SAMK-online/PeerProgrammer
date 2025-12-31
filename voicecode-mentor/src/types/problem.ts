export type Difficulty = 'easy' | 'medium' | 'hard';

export type PatternTag = 
  | 'two-pointers'
  | 'sliding-window'
  | 'hash-map'
  | 'stack'
  | 'dynamic-programming'
  | 'binary-search'
  | 'graph'
  | 'tree'
  | 'array';

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  patterns: PatternTag[];
  starterCode: {
    python: string;
    javascript: string;
    typescript: string;
  };
  hints: {
    level1: string;  // Pattern nudge
    level2: string;  // Approach guidance
    level3: string;  // Implementation detail
  };
}

