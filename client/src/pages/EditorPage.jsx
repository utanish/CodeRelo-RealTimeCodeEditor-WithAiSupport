"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Loader, Play } from "lucide-react";
import Sidebar from "./Sidebar";
import EditorToolbar from "./EditorToolbar";
import CodeEditor from "./CodeEditor";
import IOPanel from "./IOPanel";
import SettingsPanel from "./SettingsPanel";
import Notification from "./Notification";
import { getLanguageExtension, getUserColor } from "./utils";
import RelobotChatbot from "./RelobotChatbot";
import "./EditorPage.css";

export default function EditorPage({ socket }) {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "Guest");
  const [code, setCode] = useState("// Start coding...\n");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(14);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSidebarToggle, setShowSidebarToggle] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [clients, setClients] = useState([]);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [horizontalSplit, setHorizontalSplit] = useState(60);
  const [verticalSplit, setVerticalSplit] = useState(50);

  const settingsRef = useRef(null);
  const editorContainerRef = useRef(null);
  const horizontalDividerRef = useRef(null);
  const verticalDividerRef = useRef(null);
  const ignoreNextChange = useRef(false);
  const isMounted = useRef(true);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Show notification message
  const showNotificationMessage = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      if (isMounted.current) {
        setShowNotification(false);
      }
    }, 3000);
  };

  useEffect(() => {
    isMounted.current = true;
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      isMounted.current = false;
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    setConnected(socket.connected);

    const handleConnect = () => {
      setConnected(true);
      setUsername("");
      showNotificationMessage("Connected to server", "success");
    };

    const handleDisconnect = () => {
      setConnected(false);
      showNotificationMessage("Disconnected from server", "error");
    };

    const handleError = (error) => {
      console.error("Socket connection error:", error);
      setConnected(false);
      showNotificationMessage("Connection error", "error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    if (socket.connected) {
      socket.off("user-list");
      socket.off("code-change");
      socket.off("language-change");
      socket.off("sync-data");
      joinRoom();
    } else {
      const waitForConnect = () => {
        joinRoom();
        socket.off("connect", waitForConnect);
      };
      socket.on("connect", waitForConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("user-list");
      socket.off("code-change");
      socket.off("language-change");
      socket.off("sync-data");
    };
  }, [socket]);

  const joinRoom = () => {
    if (!socket || !socket.connected) return;
    setClients([]);
    socket.emit("join", { roomId, username });
    socket.emit("request-sync", { roomId }); // ✅ sync request
    setupRoomEvents();
  };

  const setupRoomEvents = () => {
    if (!socket) return;

    socket.off("user-list");
    socket.off("code-change");
    socket.off("language-change");
    socket.off("sync-data");

    let hasInitializedUsers = false;

    socket.on("user-list", (updatedUsers) => {
      setClients((prevUsers) => {
        const prevIds = new Set(prevUsers.map((u) => u.socketId));
        const newIds = new Set(updatedUsers.map((u) => u.socketId));

        if (!hasInitializedUsers) {
          hasInitializedUsers = true;
          return updatedUsers;
        }

        // ✅ Detect new user joins
        const newUser = updatedUsers.find(
          (u) => !prevIds.has(u.socketId) && u.username !== username
        );
        if (newUser) {
          showNotificationMessage(
            `${newUser.username} joined the room`,
            "info"
          );
        }

        // ✅ Detect user leaves
        const leftUser = prevUsers.find(
          (u) => !newIds.has(u.socketId) && u.username !== username
        );
        if (leftUser) {
          showNotificationMessage(
            `${leftUser.username} left the room 👋`,
            "info"
          );
        }

        return updatedUsers;
      });
    });

    socket.on("code-change", (incomingCode) => {
      ignoreNextChange.current = true;
      setCode(incomingCode);
    });

    socket.on("language-change", (lang) => {
      setLanguage(lang);
    });

    socket.on("sync-data", ({ code: syncedCode, language: syncedLang }) => {
      ignoreNextChange.current = true;
      setCode(syncedCode);
      setLanguage(syncedLang || "javascript");
      showNotificationMessage("Code & language synchronized", "success");
    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (ignoreNextChange.current) {
      ignoreNextChange.current = false;
      return;
    }
    if (socket && socket.connected) {
      socket.emit("code-change", { roomId, code: newCode });
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess(true);
    showNotificationMessage("Room ID copied to clipboard", "success");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const compileAndRun = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
      });
      const data = await res.json();
      setOutput(
        data.error
          ? `❌ Error:\n${data.error}`
          : data.output || "✅ Code executed."
      );
    } catch (err) {
      setOutput("❌ Server Error. Please try again.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Handle horizontal and vertical resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingHorizontal && editorContainerRef.current) {
        const containerRect =
          editorContainerRef.current.getBoundingClientRect();
        let newSplit =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;
        newSplit = Math.max(10, Math.min(90, newSplit)); // allow more range for smoother drag
        setHorizontalSplit(newSplit);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      } else if (isResizingVertical && editorContainerRef.current) {
        const ioPanel = document.querySelector(".editor-io-panel");
        if (ioPanel) {
          const ioPanelRect = ioPanel.getBoundingClientRect();
          let newSplit =
            ((e.clientY - ioPanelRect.top) / ioPanelRect.height) * 100;
          newSplit = Math.max(10, Math.min(90, newSplit)); // allow more range for smoother drag
          setVerticalSplit(newSplit);
          document.body.style.cursor = "row-resize";
          document.body.style.userSelect = "none";
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingHorizontal(false);
      setIsResizingVertical(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizingHorizontal || isResizingVertical) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingHorizontal, isResizingVertical]);

  // Make AI Assistant draggable
  useEffect(() => {
    const aiPanel = document.querySelector(".ai-assistant-panel");
    if (!aiPanel) return;

    const handleMouseDown = (e) => {
      if (!e.target.closest(".ai-assistant-header")) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = aiPanel.offsetLeft;
      const startTop = aiPanel.offsetTop;

      const handleMouseMove = (moveEvent) => {
        const newLeft = startLeft + (moveEvent.clientX - startX);
        const newTop = startTop + (moveEvent.clientY - startY);

        // Ensure the panel stays within viewport bounds
        const maxX = window.innerWidth - aiPanel.offsetWidth;
        const maxY = window.innerHeight - aiPanel.offsetHeight;

        aiPanel.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
        aiPanel.style.bottom = "auto";
        aiPanel.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
        aiPanel.style.right = "auto";
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    aiPanel.addEventListener("mousedown", handleMouseDown);

    return () => {
      aiPanel.removeEventListener("mousedown", handleMouseDown);
    };
  }, [aiSuggestion]); // Re-run when aiSuggestion changes (panel expands/collapses)

  return (
    <div
      className={`editor-container ${theme} ${zenMode ? "zen-mode" : ""}`}
      ref={editorContainerRef}
    >
      <Notification
        notificationType={notificationType}
        showNotification={showNotification}
        notificationMessage={notificationMessage}
      />
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        showSidebarToggle={showSidebarToggle}
        copyRoomId={copyRoomId}
        copySuccess={copySuccess}
        roomId={roomId}
        connected={connected}
        language={language}
        setLanguage={setLanguage}
        clients={clients}
        socket={socket}
        downloadCode={() => {
          const blob = new Blob([code], { type: "text/plain" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `code.${language}`;
          a.click();
        }}
        shareRoom={() => {
          navigator.clipboard.writeText(window.location.href);
          showNotificationMessage("Room URL copied to clipboard", "success");
        }}
        leaveRoom={() => {
          socket.emit("leave-room", { roomId }, () => navigate("/"));
        }}
        getUserColor={getUserColor}
      />
      <main className="editor-main">
        <EditorToolbar
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          getLanguageIcon={() => language.toUpperCase()}
          getFileExtension={() => language}
          isCompiling={isCompiling}
          compileAndRun={compileAndRun}
          toggleZenMode={() => setZenMode(!zenMode)}
          theme={theme}
          toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          aiLoading={aiLoading}
          onAskAI={async () => {
            setAiLoading(true);
            setAiSuggestion("");
            try {
              const res = await fetch(
                `${window.location.origin}/api/ai/suggest`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    code,
                    language,
                    message: "Please review this code",
                  }),
                }
              );
              const data = await res.json();
              setAiSuggestion(data.suggestion || "No suggestions returned.");
            } catch (err) {
              setAiSuggestion("Error fetching suggestion.");
            }
            setAiLoading(false);
          }}
        />

        <div className="editor-content">
          <div
            className="editor-code-panel glass-panel"
            style={{ width: `${horizontalSplit}%` }}
          >
            <CodeEditor
              code={code}
              handleCodeChange={handleCodeChange}
              theme={theme === "dark" ? vscodeDark : githubLight}
              getLanguageExtension={() => [
                getLanguageExtension(language, javascript, python, java, cpp),
                autocompletion({ activateOnTyping: true }),
              ]}
              fontSize={fontSize}
              horizontalSplit={horizontalSplit}
            />
          </div>
          <div
            className="horizontal-divider"
            ref={horizontalDividerRef}
            onMouseDown={() => setIsResizingHorizontal(true)}
          >
            <div className="divider-handle"></div>
          </div>
          <IOPanel
            input={input}
            setInput={setInput}
            output={output}
            verticalSplit={verticalSplit}
            setIsResizingVertical={setIsResizingVertical}
            isCompiling={isCompiling}
            compileAndRun={compileAndRun}
            horizontalSplit={horizontalSplit}
            verticalDividerRef={verticalDividerRef}
            horizontalDividerRef={horizontalDividerRef}
            editorContainerRef={editorContainerRef}
          />
        </div>
        <SettingsPanel
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          settingsRef={settingsRef}
          fontSize={fontSize}
          setFontSize={setFontSize}
          theme={theme}
          setTheme={setTheme}
        />
      </main>

      <RelobotChatbot
        theme={theme}
        aiSuggestion={aiSuggestion}
        setAiSuggestion={setAiSuggestion}
        aiLoading={aiLoading}
        setAiLoading={setAiLoading}
        code={code}
        language={language}
      />

      <button
        className="floating-run-button"
        onClick={compileAndRun}
        disabled={isCompiling}
      >
        {isCompiling ? (
          <Loader size={20} className="spinner" />
        ) : (
          <Play size={20} />
        )}
      </button>
    </div>
  );
}
