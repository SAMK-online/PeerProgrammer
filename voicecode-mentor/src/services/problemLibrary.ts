import type { Problem, Difficulty } from '../types/problem';
import problemsData from '../data/problems.json';
import blind75Data from '../data/blind75-problems.json';

class ProblemLibrary {
  private problems: Problem[];

  constructor() {
    // Combine original problems with Blind 75 and deduplicate by ID
    const allProblems = [...(problemsData as Problem[]), ...(blind75Data as Problem[])];

    // Use Map to deduplicate - last occurrence wins
    const uniqueProblemsMap = new Map<string, Problem>();
    allProblems.forEach(problem => {
      uniqueProblemsMap.set(problem.id, problem);
    });

    this.problems = Array.from(uniqueProblemsMap.values());
    console.log(`📚 Loaded ${this.problems.length} unique problems (deduplicated from ${allProblems.length} total)`);
  }

  getAllProblems(): Problem[] {
    return this.problems;
  }

  getProblemById(id: string): Problem | undefined {
    return this.problems.find(p => p.id === id);
  }

  getProblemsByDifficulty(difficulty: Difficulty): Problem[] {
    return this.problems.filter(p => p.difficulty === difficulty);
  }

  getRandomProblem(): Problem {
    const randomIndex = Math.floor(Math.random() * this.problems.length);
    return this.problems[randomIndex];
  }

  searchProblems(query: string): Problem[] {
    const lowerQuery = query.toLowerCase();
    return this.problems.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.patterns.some(pattern => pattern.toLowerCase().includes(lowerQuery))
    );
  }
}

export const problemLibrary = new ProblemLibrary();

