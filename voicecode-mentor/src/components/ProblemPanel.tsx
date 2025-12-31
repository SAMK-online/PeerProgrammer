import type { Problem } from '../types/problem';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { HINT_LEVEL_DESCRIPTIONS } from '../prompts/hintTemplates';

interface ProblemPanelProps {
  problem: Problem | null;
  hintLevel: 0 | 1 | 2 | 3;
  onRequestHint: () => void;
  onSelectProblem: () => void;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  hintLevel,
  onRequestHint,
  onSelectProblem,
}) => {
  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">Select a Problem</h2>
        <p className="text-sm text-zinc-500 max-w-md">
          Choose a data structures & algorithms problem to practice with voice-guided mentoring
        </p>
        <button
          onClick={onSelectProblem}
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-colors"
        >
          Browse Problems
        </button>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-green-700 bg-green-50 border-green-200',
    medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    hard: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-zinc-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-zinc-900 mb-2">{problem.title}</h2>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border capitalize ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              {problem.patterns.map(pattern => (
                <span
                  key={pattern}
                  className="text-xs px-2 py-1 rounded bg-white text-zinc-600 border border-zinc-200"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onSelectProblem}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Change
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/50 rounded border border-zinc-200">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-500" />
            <span className="text-sm text-zinc-900">
              Hints: <span className="font-bold">{hintLevel}/3</span>
            </span>
            <span className="text-xs text-zinc-500">
              ({HINT_LEVEL_DESCRIPTIONS[hintLevel]})
            </span>
          </div>
          <button
            onClick={onRequestHint}
            disabled={hintLevel >= 3}
            className="px-3 py-1.5 text-xs bg-yellow-600 hover:bg-yellow-700 disabled:bg-zinc-200 disabled:cursor-not-allowed text-zinc-900 rounded transition-colors"
          >
            Get Hint
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-2">Description</h3>
          <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-2">Constraints</h3>
          <ul className="space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="text-sm text-zinc-600 flex items-start gap-2">
                <ChevronRight size={16} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-2">Examples</h3>
          <div className="space-y-3">
            {problem.examples.map((example, index) => (
              <div key={index} className="p-3 bg-white/50 rounded border border-zinc-200">
                <div className="text-xs text-zinc-500 mb-1">Example {index + 1}:</div>
                <div className="text-sm font-mono space-y-1">
                  <div>
                    <span className="text-zinc-500">Input:</span>{' '}
                    <span className="text-zinc-100">{example.input}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Output:</span>{' '}
                    <span className="text-zinc-100">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="text-xs text-zinc-500 mt-2">
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

