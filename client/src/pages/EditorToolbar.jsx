"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader,
  Play,
  Maximize,
  Sun,
  Moon,
  Settings,
  Sparkles,
} from "lucide-react";

const EditorToolbar = ({
  sidebarCollapsed,
  toggleSidebar,
  getLanguageIcon,
  getFileExtension,
  isCompiling,
  compileAndRun,
  toggleZenMode,
  theme,
  toggleTheme,
  showSettings,
  setShowSettings,
  onAskAI,
  isAiLoading,
}) => (
  <div className="editor-toolbar glass-panel">
    <div className="toolbar-left">
      <button
        className="icon-button mobile-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>
      <div className="file-info">
        <span className="language-badge">{getLanguageIcon()}</span>
        <span className="file-name">code.{getFileExtension()}</span>
      </div>
    </div>
    <div className="toolbar-right">
      <button
        className={`run-button ${isAiLoading ? "loading" : ""}`}
        onClick={onAskAI}
        disabled={isAiLoading}
        aria-label="Ask AI for suggestions"
      >
        {isAiLoading ? (
          <>
            <Loader size={16} className="spinner" />
            <span>AI thinking...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Ask AI</span>
          </>
        )}
      </button>
      <button
        className={`run-button ${isCompiling ? "compiling" : ""}`}
        onClick={compileAndRun}
        disabled={isCompiling}
        aria-label="Run code"
      >
        {isCompiling ? (
          <>
            <Loader size={16} className="spinner" />
            <span>Running...</span>
          </>
        ) : (
          <>
            <Play size={16} />
            <span>Run Code</span>
          </>
        )}
      </button>
      <button
        className="icon-button zen-toggle"
        onClick={toggleZenMode}
        title="Toggle Zen Mode"
        aria-label="Toggle zen mode"
      >
        <Maximize size={18} />
      </button>
      <button
        className="icon-button theme-toggle"
        onClick={toggleTheme}
        title="Toggle Theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button
        className="icon-button settings-toggle"
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  </div>
);

export default EditorToolbar;
