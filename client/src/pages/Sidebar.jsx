"use client";
import logo from "../assets/ShreeNathji.svg";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Download,
  Share2,
  LogOut,
  Github,
  Linkedin,
  FileText,
  Code,
  Users,
} from "lucide-react";

const Sidebar = ({
  sidebarCollapsed,
  toggleSidebar,
  showSidebarToggle,
  copyRoomId,
  copySuccess,
  roomId,
  connected,
  language,
  setLanguage,
  clients,
  socket,
  downloadCode,
  shareRoom,
  leaveRoom,
  getUserColor,
}) => {
  // Handle language change and emit to socket
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    if (socket && socket.connected) {
      socket.emit("language-change", { roomId, language: newLang });
    }
  };

  return (
    <>
      <div className="sidebar-edge-area">
        {showSidebarToggle && (
          <button
            className="sidebar-expand-button glass-button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      <aside
        className={`sidebar glass-panel ${sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <div className="editor-logo">
            <div className="logo-icon">
              <img src={logo} alt="Code-Relo Logo" className="logo-image" />
            </div>
            <span className="logo-text">Code-Relo</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Room Information</h3>
          <div className="room-info">
            <div className="info-label">Room ID</div>
            <div className="room-id-display glass-input">
              <code className="room-id-text">{roomId}</code>
              <button
                className={`icon-button ${copySuccess ? "success" : ""}`}
                onClick={copyRoomId}
                title="Copy Room ID"
                aria-label="Copy Room ID"
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Connection</h3>
          <div className="connection-status">
            <div
              className={`status-indicator ${
                connected ? "connected" : "disconnected"
              }`}
            ></div>
            <span className="status-text">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Language</h3>
          <select
            className="language-select glass-input"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select programming language"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="sidebar-section users-section">
          <h3 className="section-title">
            <div className="section-title-with-icon">
              <Users size={14} />
              <span>Participants ({clients.length})</span>
            </div>
          </h3>
          <div className="users-list">
            {clients.map((client) => (
              <div key={client.socketId} className="user-item">
                <div
                  className="user-avatar"
                  style={{ backgroundColor: getUserColor(client.socketId) }}
                >
                  {client.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{client.username}</span>
                  {client.socketId === socket?.id && (
                    <span className="user-badge">You</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-actions">
          <button
            className="action-button download-btn glass-button"
            onClick={downloadCode}
            aria-label="Download code"
            title="Download code"
          >
            <Download size={16} />
            <span>Download Code</span>
          </button>
          <button
            className="action-button share-btn glass-button"
            onClick={shareRoom}
            aria-label="Share room"
            title="Share room link"
          >
            <Share2 size={16} />
            <span>Share Room</span>
          </button>
          <button
            className="action-button leave-btn glass-button"
            onClick={leaveRoom}
            aria-label="Leave room"
            title="Leave this room"
          >
            <LogOut size={16} />
            <span>Leave Room</span>
          </button>
        </div>

        <div className="developer-info">
          <p>Developed by Tanish Upadhyay</p>
          <div className="social-links">
            <a
              href="https://github.com/tanishupadhyay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/tanishupadhyay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://tanishupadhyay.com/resume"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume"
              title="Resume"
            >
              <FileText size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
