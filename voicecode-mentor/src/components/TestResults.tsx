import { CheckCircle2, XCircle, Play } from 'lucide-react';

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  error?: string;
}

interface TestResultsProps {
  results: TestResult[];
  isRunning: boolean;
  onRunTests: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  isRunning,
  onRunTests,
}) => {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200">
        <h3 className="text-sm font-medium text-zinc-900">Test Results</h3>
        <button
          onClick={onRunTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-white disabled:bg-zinc-300 disabled:cursor-not-allowed text-zinc-900 text-sm rounded transition-colors"
        >
          <Play size={14} />
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      {results.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-3">
          <div className="text-zinc-500 text-sm">
            Click "Run Tests" to validate your solution
          </div>
          <div className="text-xs text-zinc-600 bg-zinc-50 px-3 py-2 rounded border border-zinc-200">
            💡 <strong>First run?</strong> Python tests may take 5-10 seconds to initialize the runtime
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-sm font-medium text-zinc-900 mb-3">
            {passedCount} / {totalCount} tests passed
          </div>
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                result.passed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {result.passed ? (
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 text-xs space-y-1">
                  <div>
                    <span className="text-zinc-500">Input: </span>
                    <span className="text-zinc-900 font-mono">{result.input}</span>
                  </div>
                  {!result.passed && (
                    <>
                      <div>
                        <span className="text-zinc-500">Expected: </span>
                        <span className="text-zinc-900 font-mono">{result.expectedOutput}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Got: </span>
                        <span className="text-red-700 font-mono">
                          {result.actualOutput || 'No output'}
                        </span>
                      </div>
                      {result.error && (
                        <div className="text-red-700 mt-1">
                          Error: {result.error}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

