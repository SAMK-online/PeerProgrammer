import type { Problem } from '../types/problem';
import { generateHint as geminiGenerateHint } from './vertexai';

export const getHintForProblem = async (
  problem: Problem,
  currentCode: string,
  hintLevel: 1 | 2 | 3
): Promise<string> => {
  try {
    // First, try to use Gemini for contextual hints
    const hint = await geminiGenerateHint(
      `${problem.title}\n\n${problem.description}`,
      currentCode,
      hintLevel
    );
    return hint;
  } catch (error) {
    console.error('Failed to generate contextual hint, falling back to predefined hints:', error);
    
    // Fallback to predefined hints from problem data
    switch (hintLevel) {
      case 1:
        return problem.hints.level1;
      case 2:
        return problem.hints.level2;
      case 3:
        return problem.hints.level3;
      default:
        return problem.hints.level1;
    }
  }
};

export const requestHint = async (
  problem: Problem | null,
  currentCode: string,
  currentHintLevel: number
): Promise<{ hint: string; newLevel: number }> => {
  if (!problem) {
    return {
      hint: 'Please select a problem first to get hints.',
      newLevel: currentHintLevel,
    };
  }

  if (currentHintLevel >= 3) {
    return {
      hint: 'You\'ve used all available hints. Try implementing the solution or ask for the complete answer via voice!',
      newLevel: 3,
    };
  }

  const newLevel = (currentHintLevel + 1) as 1 | 2 | 3;
  const hint = await getHintForProblem(problem, currentCode, newLevel);

  return {
    hint,
    newLevel,
  };
};

