"use client";

import { useState, useEffect, useRef } from "react";
import "./RelobotChatbot.css";
import {
  Sparkle,
  Send,
  Minimize,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function RelobotChatbot({
  theme = "light",
  aiSuggestion,
  setAiSuggestion,
  aiLoading,
  setAiLoading,
  code,
  language,
}) {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hidden, setHidden] = useState(true); // Start with the chatbot hidden
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Add Outfit font to document
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Show chatbot when AI starts thinking
  useEffect(() => {
    if (aiLoading) {
      setHidden(false);
    }
  }, [aiLoading]);

  // Add message to chat when AI responds
  useEffect(() => {
    if (aiSuggestion && !aiLoading) {
      setMessages((prev) => [...prev, { type: "ai", content: aiSuggestion }]);
    }
  }, [aiSuggestion, aiLoading]);

  const handleAskClick = async () => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    // Ensure scroll to bottom when user sends a message
    setTimeout(scrollToBottom, 0);

    // Start loading state
    setAiLoading(true);
    setAiSuggestion("");

    // Always show the chat when asking a question
    setHidden(false);

    try {
      const res = await fetch("http://localhost:3000/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, message: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      setAiSuggestion(
        data.suggestion || "I couldn't generate a suggestion at this time."
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiSuggestion(
        "⚠️ I encountered an error while processing your request."
      );
    }

    setAiLoading(false);
    setUserMessage("");

    // Focus input after sending
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskClick();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setAiSuggestion("");
  };

  const minimizeChat = () => {
    setHidden(true);
  };

  const showChat = () => {
    setHidden(false);
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  if (hidden) {
    return (
      <button
        className="relobot-float-button"
        onClick={showChat}
        aria-label="Open chat"
      >
        <div className="relobot-avatar">
          <Sparkle size={24} />
        </div>
      </button>
    );
  }

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      };

      if (inline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      return (
        <div className="relobot-code-block">
          <button className="copy-icon-button" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <SyntaxHighlighter
            style={atomOneDark}
            language={className?.replace("language-", "") || "javascript"}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  return (
    <div className={`relobot-container ${theme}`}>
      <div className="relobot-header">
        <div className="relobot-title">
          <div
            className="relobot-avatar"
            role="img"
            aria-label="Relobot avatar"
          >
            <Sparkle size={20} />
          </div>
          <span>Relobot Assistant</span>
        </div>
        <div className="relobot-actions">
          <button
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear chat"
            className="relobot-action-button"
          >
            ×
          </button>
          <button
            onClick={minimizeChat}
            aria-label="Minimize chat"
            title="Minimize chat"
            className="relobot-minimize-button"
          >
            <Minimize size={16} />
          </button>
        </div>
      </div>

      <div className="relobot-chat" ref={chatRef}>
        {messages.length === 0 ? (
          <div className="relobot-empty-state">
            <div className="relobot-empty-icon">
              <MessageCircle size={40} />
            </div>
            <div className="relobot-empty-title">Start a conversation</div>
            <div className="relobot-empty-description">
              Ask me anything about your code like "What's the error" , ""
              "Optimize the code".
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              className="relobot-message"
              key={index}
              data-user={msg.type === "user"}
            >
              <div className="relobot-message-meta">
                {msg.type !== "user" && (
                  <div
                    className="relobot-avatar small"
                    role="img"
                    aria-label="Relobot avatar"
                  >
                    <Sparkle size={14} />
                  </div>
                )}
                <span>{msg.type === "ai" ? "Relobot" : "You"}</span>
                {msg.type === "user" && (
                  <div
                    className="relobot-avatar small user"
                    role="img"
                    aria-label="User avatar"
                  >
                    👤
                  </div>
                )}
              </div>
              <ReactMarkdown components={MarkdownComponents}>
                {msg.content}
              </ReactMarkdown>
            </div>
          ))
        )}

        {aiLoading && (
          <div className="relobot-loading" aria-live="polite">
            <div
              className="typing-indicator"
              role="status"
              aria-label="Relobot is thinking"
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className="relobot-footer">
        <div className="relobot-input-container">
          <textarea
            ref={inputRef}
            className="relobot-input"
            placeholder="Ask something about your code..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Message input"
            rows="3"
          />
        </div>
        <button
          className="relobot-send-button"
          onClick={handleAskClick}
          disabled={aiLoading || !userMessage.trim()}
          aria-label={aiLoading ? "Processing..." : "Send message"}
        >
          <Send size={18} className="relobot-send-icon" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
