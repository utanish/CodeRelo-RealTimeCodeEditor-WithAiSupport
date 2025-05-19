// Utility functions for EditorPage

export const getLanguageExtension = (
  language,
  javascript,
  python,
  java,
  cpp
) => {
  switch (language) {
    case "javascript":
      return javascript();
    case "python":
      return python();
    case "java":
      return java();
    case "cpp":
      return cpp();
    default:
      return javascript();
  }
};

export const getUserColor = (socketId) => {
  const colors = [
    "#FF5D8F",
    "#9C6ADE",
    "#50B83C",
    "#47C1BF",
    "#5C6AC4",
    "#9C6ADE",
    "#F49342",
    "#DE5B49",
    "#006FBB",
    "#BF5AF2",
  ];
  const hash = socketId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
