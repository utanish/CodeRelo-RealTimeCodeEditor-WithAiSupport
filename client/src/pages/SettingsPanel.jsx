import React from "react";

const SettingsPanel = ({
  showSettings,
  setShowSettings,
  settingsRef,
  fontSize,
  setFontSize,
  theme,
  setTheme,
}) =>
  showSettings && (
    <div className="settings-panel glass-panel" ref={settingsRef}>
      <div className="settings-header">
        <h3>Editor Settings</h3>
      </div>
      <div className="settings-content">
        <div className="settings-group">
          <label htmlFor="font-size">Font Size</label>
          <div className="font-size-control">
            <button
              className="font-size-btn"
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              disabled={fontSize <= 12}
              aria-label="Decrease font size"
            >
              -
            </button>
            <span className="font-size-value" id="font-size">
              {fontSize}px
            </span>
            <button
              className="font-size-btn"
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              disabled={fontSize >= 24}
              aria-label="Increase font size"
            >
              +
            </button>
          </div>
        </div>
        <div className="settings-group">
          <label>Theme</label>
          <div className="theme-selector">
            <button
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
              aria-label="Dark theme"
            >
              Dark
            </button>
            <button
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
              aria-label="Light theme"
            >
              Light
            </button>
          </div>
        </div>
      </div>
    </div>
  );

export default SettingsPanel;
