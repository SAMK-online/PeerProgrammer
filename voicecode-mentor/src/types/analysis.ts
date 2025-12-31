export interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface CodeAnalysis {
  isCorrect: boolean;
  complexity: ComplexityAnalysis;
  edgeCases: {
    handled: string[];
    missing: string[];
  };
  suggestions: string[];
  errors?: string[];
}

