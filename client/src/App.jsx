import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";

function App() {
  const [socket, setSocket] = useState(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    // Initialize socket connection at the App level
    const newSocket = io(window.location.origin, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("App: Connected to server with socket ID:", newSocket.id);
      setSocketReady(true);
    });

    newSocket.on("disconnect", () => {
      console.log("App: Disconnected from server");
      setSocketReady(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("App: Socket connection error:", error);
      setSocketReady(false);
    });

    setSocket(newSocket);

    // Clean up function
    return () => {
      console.log("App: Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, []);

  // Add CSS to make user list work properly
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .users-list {
        list-style-type: none;
        padding: 0;
        margin: 8px 0;
      }
      
      .users-list li {
        padding: 4px 8px;
        margin-bottom: 4px;
        background-color: #2d2d2d;
        border-radius: 4px;
      }
      
      .connection-status {
        margin: 10px 0;
        font-size: 14px;
      }
      
      .connected {
        color: #4caf50;
        font-weight: bold;
      }
      
      .disconnected {
        color: #f44336;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/editor/:roomId"
          element={
            socketReady ? (
              <EditorPage socket={socket} />
            ) : (
              <div className="loading">Connecting to server...</div>
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
