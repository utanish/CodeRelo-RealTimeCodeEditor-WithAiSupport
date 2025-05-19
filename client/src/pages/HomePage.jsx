import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    setUsername("");
  }, []);

  const handleJoin = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }

    localStorage.setItem("code-sync-username", username);
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/editor/${roomId}`, { state: { username } });
    }, 800);
  };

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    setRoomId(newRoomId);
  };

  return (
    <div className="home-container">
      <div className="background-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="code-pattern"></div>
      </div>

      <main className={`home-content ${showAnimation ? "animate-in" : ""}`}>
        <section className="brand">
          <div className="logo">
            <span className="logo-bracket">{`{`}</span>
            <span className="logo-bracket" style={{ margin: "0 20px" }}>
              Code-Relo
            </span>
            <span className="logo-bracket">{`}`}</span>
          </div>
          <h1 className="title">Real-Time Collaborative Code Editor</h1>
          <p className="subtitle">
            Code together. Create together. In real-time.
          </p>
        </section>

        <section className="join-container">
          <div className="input-wrapper">
            <label htmlFor="username">Your Name</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="roomId">Room ID</label>
            <div className="room-input-group">
              <input
                id="roomId"
                type="text"
                placeholder="Enter room ID or create new"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button className="create-btn" onClick={handleCreateRoom}>
                Generate
              </button>
            </div>
          </div>

          <button
            className={`join-btn ${isLoading ? "loading" : ""}`}
            onClick={handleJoin}
            disabled={isLoading}
          >
            {isLoading ? <span className="loader"></span> : <>Join Session</>}
          </button>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div className="feature-text">
              <h3>Real-Time Collaboration</h3>
              <p>
                Code with your team in real-time, see changes as they happen
              </p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div className="feature-text">
              <h3>Multiple Languages</h3>
              <p>Support for JavaScript, Python, Java, and C++</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="feature-text">
              <h3>Private Rooms</h3>
              <p>Create private coding sessions with unique room IDs</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="feature-text">
              <h3>AI Code Assistant</h3>
              <p>
                Get intelligent code suggestions and help from our built-in AI
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>CodeRelo • Designed & Developed by Tanish Upadhyay</p>
        <div className="social-links">
          <a
            href="https://github.com/tanishupadhyay"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="#resume" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <a
            href="https://linkedin.com/in/tanishupadhyay"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
