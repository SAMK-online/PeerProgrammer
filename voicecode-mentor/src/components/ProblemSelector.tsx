import { useState } from 'react';
import { X, Search, Code } from 'lucide-react';
import type { Problem, Difficulty } from '../types/problem';
import { problemLibrary } from '../services/problemLibrary';

interface ProblemSelectorProps {
  onSelect: (problem: Problem) => void;
  onClose: () => void;
}

export const ProblemSelector: React.FC<ProblemSelectorProps> = ({
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  const allProblems = problemLibrary.getAllProblems();
  const filteredProblems = allProblems.filter(problem => {
    const matchesSearch = 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.patterns.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const difficultyColors = {
    easy: 'text-green-400 bg-green-950/30 border-green-800/50',
    medium: 'text-yellow-400 bg-yellow-950/30 border-yellow-800/50',
    hard: 'text-red-400 bg-red-950/30 border-red-800/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[80vh] bg-zinc-50 rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900">Select a Problem</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-200 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems by title, description, or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-1.5 text-sm rounded border capitalize transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-600'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
              <Search size={48} className="mb-2 opacity-50" />
              <p>No problems found matching your criteria</p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => {
                  onSelect(problem);
                  onClose();
                }}
                className="w-full p-4 bg-white hover:bg-zinc-750 border border-zinc-200 hover:border-zinc-600 rounded transition-colors text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Code size={20} className="text-blue-400 flex-shrink-0" />
                    <h3 className="text-base font-semibold text-zinc-900 group-hover:text-blue-400 transition-colors">
                      {problem.title}
                    </h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border capitalize flex-shrink-0 ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mb-2 line-clamp-2">
                  {problem.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {problem.patterns.map(pattern => (
                    <span
                      key={pattern}
                      className="text-xs px-2 py-0.5 rounded bg-zinc-200 text-zinc-600"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 text-sm text-zinc-500 text-center">
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};

