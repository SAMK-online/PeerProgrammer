import type { Problem } from '../types/problem';

export const generateHint = (problem: Problem, level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return problem.hints.level1;
    case 2:
      return problem.hints.level2;
    case 3:
      return problem.hints.level3;
    default:
      return problem.hints.level1;
  }
};

export const HINT_LEVEL_DESCRIPTIONS = {
  0: 'No hints used yet',
  1: 'Pattern recognition hint',
  2: 'Approach guidance hint',
  3: 'Implementation details hint',
};

