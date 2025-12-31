import { editor } from 'monaco-editor';

export const monacoOptions: editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'Fira Code, Menlo, Monaco, Courier New, monospace',
  lineNumbers: 'on',
  minimap: {
    enabled: true,
  },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: false,
  },
  padding: {
    top: 16,
    bottom: 16,
  },
};

export const languageMap = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
} as const;

export type SupportedLanguage = keyof typeof languageMap;

