import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CodeAnalysis } from '../types/analysis';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured');
    return false;
  }
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return true;
};

export const analyzeCode = async (
  code: string,
  problemDescription: string
): Promise<CodeAnalysis> => {
  if (!genAI) {
    const initialized = initializeGemini();
    if (!initialized) {
      throw new Error('Gemini API not configured');
    }
  }

  try {
    const model = genAI!.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this code solution for the following problem:

Problem: ${problemDescription}

Code:
\`\`\`
${code}
\`\`\`

Provide a JSON response with:
1. isCorrect: boolean - whether the solution is correct
2. complexity: {timeComplexity: string, spaceComplexity: string, explanation: string}
3. edgeCases: {handled: string[], missing: string[]}
4. suggestions: string[] - improvements or optimizations
5. errors: string[] - any bugs or issues found

Response format:
{
  "isCorrect": true/false,
  "complexity": {
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "explanation": "..."
  },
  "edgeCases": {
    "handled": ["empty array", "single element"],
    "missing": ["negative numbers"]
  },
  "suggestions": ["Consider..."],
  "errors": []
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis as CodeAnalysis;
    }

    throw new Error('Could not parse Gemini response');
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
};

export const generateHint = async (
  problemDescription: string,
  currentCode: string,
  hintLevel: number
): Promise<string> => {
  if (!genAI) {
    const initialized = initializeGemini();
    if (!initialized) {
      return 'API not configured. Please set up your Gemini API key.';
    }
  }

  try {
    const model = genAI!.getGenerativeModel({ model: 'gemini-pro' });

    let hintPrompt = '';
    switch (hintLevel) {
      case 1:
        hintPrompt = 'Give a high-level pattern hint (e.g., "This is a two-pointers problem" or "Think about hash maps")';
        break;
      case 2:
        hintPrompt = 'Give an approach guidance hint with specific data structures but not implementation details';
        break;
      case 3:
        hintPrompt = 'Give detailed implementation guidance including pseudocode';
        break;
      default:
        hintPrompt = 'Give a gentle nudge in the right direction';
    }

    const prompt = `You are a patient coding mentor. For this problem:

${problemDescription}

Current student code:
\`\`\`
${currentCode || 'No code written yet'}
\`\`\`

${hintPrompt}

Keep your hint concise (2-3 sentences) and encouraging. Ask Socratic questions when appropriate.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating hint:', error);
    return 'Sorry, I encountered an error generating a hint. Try breaking down the problem step by step.';
  }
};

