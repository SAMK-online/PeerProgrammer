import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let initializationPromise: Promise<PyodideInterface> | null = null;

/**
 * Initialize Pyodide (loads ~10MB WASM runtime)
 * This is called automatically on first execution
 */
export const initializePyodide = async (): Promise<PyodideInterface> => {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  console.log('🐍 Initializing Pyodide (Python in browser)...');

  initializationPromise = loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/',
  }).then((pyodide) => {
    pyodideInstance = pyodide;
    console.log('✅ Pyodide initialized successfully');
    return pyodide;
  }).catch((error) => {
    console.error('❌ Pyodide initialization failed:', error);
    initializationPromise = null;
    throw error;
  });

  return initializationPromise;
};

/**
 * Execute Python code safely in the browser
 */
export const executePythonCode = async (
  code: string,
  testInput: string
): Promise<{ output: string; error?: string }> => {
  try {
    const pyodide = await initializePyodide();

    // Clear previous state
    pyodide.runPython('import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');

    // Indent user's code to match try block indentation (4 spaces)
    const indentedCode = code.split('\n').map(line => '    ' + line).join('\n');

    // Escape the test input and user code for safe injection
    const escapedTestInput = testInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const escapedUserCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

    // Parse test input to Python format
    const wrappedCode = `
import json
import sys
from io import StringIO

# Redirect stdout to capture prints
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
    # User's code
${indentedCode}

    # Parse input
    test_input = "${escapedTestInput}"

    # Try to parse as JSON array (handles both single and multiple args)
    try:
        # Wrap in brackets and parse as array: "[2,7], 9" → "[[2,7], 9]"
        args = json.loads(f'[{test_input}]')
    except:
        # If JSON parsing fails, try as single value
        try:
            args = [json.loads(test_input)]
        except:
            # Last resort: treat as string
            args = [test_input]

    # Find the first function defined in user code
    import re
    func_match = re.search(r'def\\s+(\\w+)\\s*\\(', "${escapedUserCode}")
    if func_match:
        func_name = func_match.group(1)
        result = eval(f'{func_name}(*args)')

        # Get any printed output
        printed = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # Return result as JSON
        result_json = json.dumps({"result": result, "stdout": printed})
    else:
        sys.stdout = old_stdout
        result_json = json.dumps({"error": "No function found in code"})

except Exception as e:
    sys.stdout = old_stdout
    result_json = json.dumps({"error": str(e)})

result_json
`;

    const resultJson = pyodide.runPython(wrappedCode);
    const result = JSON.parse(resultJson);

    if (result.error) {
      return { output: '', error: result.error };
    }

    return { 
      output: JSON.stringify(result.result),
      error: undefined 
    };
  } catch (error: any) {
    console.error('Python execution error:', error);
    return { 
      output: '', 
      error: error.message || 'Python execution failed' 
    };
  }
};

/**
 * Check if Pyodide is ready
 */
export const isPyodideReady = (): boolean => {
  return pyodideInstance !== null;
};

