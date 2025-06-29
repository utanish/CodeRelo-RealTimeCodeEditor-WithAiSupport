# Real-Time Collaborative Code Editor

This project is a full-stack real-time collaborative code editor that allows multiple users to write and execute code simultaneously in various programming languages. It features AI-assisted code suggestions, secure code execution via Docker, and live synchronization through WebSockets. The application supports room-based collaboration where each session has a unique room ID for users to join and collaborate in real time.

**Deployed Link:** [(https://coderelo-realtimecodeeditor-withaisupport.onrender.com)](https://coderelo-realtimecodeeditor-withaisupport.onrender.com)

## Features

* Real-time code collaboration using Socket.IO
* Code execution support for Python, C++, Java, and JavaScript
* Docker-based sandboxed execution
* AI-powered code suggestions using Gemini 1.5 Flash
* Multi-user live editing and presence indication
* Unique room IDs for separate collaborative sessions
* Vite-powered React frontend for fast UI
* Express backend handling API and WebSocket connections

## Tech Stack

**Frontend:** React, Vite, Socket.IO-client
**Backend:** Node.js, Express, Socket.IO, Docker
**AI Integration:** Google Gemini SDK (`@google/genai`)
**Containerization:** Docker (multi-stage build)

---

## Project Structure

```
project-root/
├── client/                  # React frontend
│   ├── public/
│   └── src/
├── server/                  # Express backend
│   ├── docker/              # Language-specific Dockerfiles
│   ├── index.js             # Entry point
│   └── ...
├── Dockerfile              # Multi-stage build Dockerfile
└── README.md
```

---

## Local Setup Instructions

### Prerequisites

* Node.js (v18 or later)
* Docker installed and running
* npm or yarn

### 1. Clone the Repository

```
git clone https://github.com/yourusername/repo-name.git
cd repo-name
```

### 2. Build the Docker Image

```
docker build -t code-editor-app .
```

### 3. Run the Container

```
docker run -it -p 3000:3000 \
  --privileged \
  -v /var/run/docker.sock:/var/run/docker.sock \
  code-editor-app
```

Visit `http://localhost:3000` in your browser to access the app.

---

## Environment Variables

In the frontend (`client/.env`):

```
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

---

## Code Execution Logic

* The backend receives code, language, and input via Socket.IO.
* Based on language, it selects the corresponding Dockerfile.
* Spawns a container with volume mounts and execution commands.
* Captures `stdout` and `stderr` and returns to the frontend.

---

## AI Suggestions

The app uses the Google Gemini SDK to:

* Suggest code completions
* Refactor code on user request
* Provide contextual explanations

You must supply your own API key from [Google AI Studio](https://makersuite.google.com/).

---

## Screenshots

To visually understand the functionality and UI, below are some representative screenshots:

### Home Page : Room ID Creation

<img width="1680" alt="image" src="https://github.com/user-attachments/assets/028c9397-2c0a-49b4-97ef-25653017cc8a" />


### Code Editor
<img width="1680" alt="image" src="https://github.com/user-attachments/assets/21e4acad-e2b4-4149-a44e-eb64c5bb9710" />


### Input and Output Panel

<img width="1680" alt="image" src="https://github.com/user-attachments/assets/73c57819-b943-4f14-a9f1-9b13c856b46d" />

### Relobot : Coding AI Chatbot

<img width="1680" alt="image" src="https://github.com/user-attachments/assets/6413713a-d5c2-4330-804b-76e30787c4e0" />


---

## License

This project is licensed under the MIT License. You are free to use, distribute, and modify it under the terms of the license.

---

## Author

Tanish Upadhyay
GitHub: [@utanish](https://github.com/utanish)
LinkedIn: [linkedin.com/in/tanish-upadhyay/](https://linkedin.com/in/tanish-upadhyay)

Feel free to contribute or raise an issue if you encounter bugs or have suggestions for improvements.
