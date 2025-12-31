import type { Problem } from '../types/problem';
import type { TestResult } from '../components/TestResults';
import { executePythonCode, initializePyodide } from './pythonExecutor';

export const runTests = async (
  code: string,
  problem: Problem,
  language: 'python' | 'javascript' | 'typescript'
): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Pre-initialize Pyodide for Python tests
  if (language === 'python') {
    console.log('🐍 Preparing Python runtime...');
    await initializePyodide();
  }

  for (const testCase of problem.testCases) {
    try {
      // For demo purposes, we'll do basic JavaScript evaluation
      // In production, you'd want to use a proper code execution sandbox
      
      if (language === 'javascript' || language === 'typescript') {
        // Extract function name from problem
        const functionMatch = code.match(/function\s+(\w+)/);
        if (!functionMatch) {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            passed: false,
            error: 'No function found in code',
          });
          continue;
        }

        // Evaluate the code
        const evalCode = `
          ${code}
          
          // Parse input
          const parseInput = (input) => {
            try {
              const parts = input.split(',').map(s => s.trim());
              if (parts.length === 1) {
                // Single array or string
                return [JSON.parse(parts[0])];
              } else {
                // Array and target, or multiple params
                const arr = JSON.parse(parts[0]);
                const rest = parts.slice(1).map(p => {
                  try {
                    return JSON.parse(p);
                  } catch {
                    return p.replace(/"/g, '');
                  }
                });
                return [arr, ...rest];
              }
            } catch (e) {
              return [input];
            }
          };
          
          const args = parseInput(\`${testCase.input}\`);
          const result = ${functionMatch[1]}(...args);
          JSON.stringify(result);
        `;

        try {
          const actualOutput = eval(evalCode);
          const passed = actualOutput === testCase.expectedOutput;
          
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput,
            passed,
          });
        } catch (error: any) {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            passed: false,
            error: error.message,
          });
        }
      } else if (language === 'python') {
        // Python - use Pyodide (WASM runtime in browser)
        try {
          const { output, error } = await executePythonCode(code, testCase.input);
          
          if (error) {
            results.push({
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              passed: false,
              error: error,
            });
          } else {
            const passed = output === testCase.expectedOutput;
            results.push({
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: output,
              passed,
            });
          }
        } catch (error: any) {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            passed: false,
            error: error.message || 'Python execution failed',
          });
        }
      }
    } catch (error: any) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        passed: false,
        error: error.message || 'Unknown error',
      });
    }
  }

  return results;
};

