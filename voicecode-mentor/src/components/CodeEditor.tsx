import { Editor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { monacoOptions, type SupportedLanguage, languageMap } from '../config/monacoConfig';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onMount?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  onMount,
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Auto-save to localStorage on change
    const timer = setTimeout(() => {
      if (value) {
        localStorage.setItem('voicecode-current-code', value);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
    onMount?.();
  };

  return (
    <div className="h-full w-full bg-white">
      <Editor
        height="100%"
        language={languageMap[language]}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={monacoOptions}
        theme="vs"
      />
    </div>
  );
};

