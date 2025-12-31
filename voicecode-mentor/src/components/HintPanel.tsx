import { Lightbulb, X } from 'lucide-react';

interface HintPanelProps {
  hint: string | null;
  hintLevel: number;
  onClose: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hint,
  hintLevel,
  onClose,
}) => {
  if (!hint) return null;

  const levelColors = {
    1: 'border-blue-200 bg-blue-50',
    2: 'border-yellow-200 bg-yellow-50',
    3: 'border-red-200 bg-red-50',
  };

  const levelNames = {
    1: 'Pattern Recognition',
    2: 'Approach Guidance',
    3: 'Implementation Details',
  };

  return (
    <div className={`absolute top-4 right-4 left-4 z-50 p-4 rounded-lg border-2 shadow-lg ${
      levelColors[hintLevel as 1 | 2 | 3] || levelColors[1]
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-600" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Hint Level {hintLevel}/3
            </h3>
            <p className="text-xs text-zinc-500">
              {levelNames[hintLevel as 1 | 2 | 3] || 'Hint'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">
        {hint}
      </p>
    </div>
  );
};

