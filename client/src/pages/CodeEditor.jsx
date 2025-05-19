"use client";
import CodeMirror from "@uiw/react-codemirror";

const CodeEditor = ({
  code,
  handleCodeChange,
  theme,
  getLanguageExtension,
  fontSize,
  horizontalSplit,
}) => {
  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={theme}
      extensions={getLanguageExtension()}
      onChange={handleCodeChange}
      style={{ fontSize: `${fontSize}px` }}
      className="code-mirror-wrapper"
    />
  );
};

export default CodeEditor;
