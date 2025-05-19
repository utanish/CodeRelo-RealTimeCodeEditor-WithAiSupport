"use client";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <button
      className={`icon-button theme-toggle ${isAnimating ? "animating" : ""}`}
      onClick={handleToggle}
      title="Toggle Theme"
      aria-label="Toggle theme"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isAnimating ? "rotate(180deg)" : "rotate(0deg)",
          opacity: isAnimating ? 0 : 1,
          transition: "transform 0.5s ease, opacity 0.5s ease",
        }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isAnimating ? "rotate(0deg)" : "rotate(-180deg)",
          opacity: isAnimating ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease",
        }}
      >
        {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
