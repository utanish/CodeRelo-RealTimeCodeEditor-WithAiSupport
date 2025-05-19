"use client";
import { Terminal, Send } from "lucide-react";

const IOPanel = ({
  input,
  setInput,
  output,
  verticalSplit,
  setIsResizingVertical,
  isCompiling,
  compileAndRun,
  horizontalSplit,
  verticalDividerRef,
  horizontalDividerRef,
  editorContainerRef,
}) => (
  <div
    className="editor-io-panel glass-panel"
    style={{ width: `${100 - horizontalSplit}%` }}
  >
    <div
      className="input-panel glass-panel"
      style={{ height: `${verticalSplit}%` }}
    >
      <div className="panel-header">
        <h3>
          <Terminal size={14} /> Input
        </h3>
      </div>
      <textarea
        className="input-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for your program here..."
        aria-label="Program input"
      />
    </div>
    <div
      className="vertical-divider"
      ref={verticalDividerRef}
      onMouseDown={() => setIsResizingVertical(true)}
    >
      <div className="divider-handle"></div>
    </div>
    <div
      className="output-panel glass-panel"
      style={{ height: `${100 - verticalSplit}%` }}
    >
      <div className="panel-header">
        <h3>
          <Send size={14} /> Output
        </h3>
        <div className="output-actions">
          {isCompiling && <span className="output-status">Running...</span>}
        </div>
      </div>
      <pre className="output-display" aria-live="polite">
        {output || "Run your code to see output here."}
      </pre>
    </div>
  </div>
);

export default IOPanel;
