import { analyzeCode as geminiAnalyze } from './vertexai';
import type { CodeAnalysis } from '../types/analysis';
import type { Problem } from '../types/problem';

export const analyzeCodeSolution = async (
  code: string,
  problem: Problem
): Promise<CodeAnalysis> => {
  if (!code || code.trim().length === 0) {
    return {
      isCorrect: false,
      complexity: {
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        explanation: 'No code provided',
      },
      edgeCases: {
        handled: [],
        missing: problem.constraints.map(c => c),
      },
      suggestions: ['Start by writing your function signature and understanding the problem constraints'],
      errors: ['No code written yet'],
    };
  }

  try {
    const problemDescription = `${problem.title}\n\n${problem.description}\n\nConstraints:\n${problem.constraints.join('\n')}`;
    return await geminiAnalyze(code, problemDescription);
  } catch (error) {
    console.error('Error in code analysis:', error);
    return {
      isCorrect: false,
      complexity: {
        timeComplexity: 'Unknown',
        spaceComplexity: 'Unknown',
        explanation: 'Analysis failed',
      },
      edgeCases: {
        handled: [],
        missing: [],
      },
      suggestions: [],
      errors: ['Failed to analyze code. Please check your API configuration.'],
    };
  }
};

