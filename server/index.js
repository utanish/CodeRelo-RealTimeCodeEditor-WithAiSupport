import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs-extra";
import path, { dirname } from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// ==============================
// 🔒 Safe Code Execution
// ==============================
app.post("/run", async (req, res) => {
  const { code, language, input = "" } = req.body;
  const jobId = uuidv4();
  const dir = path.join("temp", jobId);
  await fs.ensureDir(dir);

  let fileName, image, runCmd;
  switch (language) {
    case "python":
      fileName = "main.py";
      image = "python:3.10";
      runCmd = `cat input.txt | python ${fileName}`;
      break;
    case "cpp":
      fileName = "main.cpp";
      image = "gcc:latest";
      runCmd = `g++ ${fileName} -o main && ./main < input.txt`;
      break;
    case "java":
      fileName = "Main.java";
      image = "openjdk:11";
      runCmd = `cat input.txt | javac ${fileName} && java Main`;
      break;
    case "javascript":
      fileName = "main.js";
      image = "node:18";
      runCmd = `cat input.txt | node ${fileName}`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  const filePath = path.join(dir, fileName);
  const inputPath = path.join(dir, "input.txt");
  await fs.writeFile(filePath, code);
  await fs.writeFile(inputPath, input);

  const dockerCmd = `docker run --rm -m 100m --cpus="0.5" -v ${path.resolve(
    dir
  )}:/app -w /app ${image} sh -c "${runCmd}"`;

  exec(dockerCmd, { timeout: 5000 }, async (err, stdout, stderr) => {
    await fs.remove(dir);
    if (err) {
      return res.status(200).json({ error: stderr || "Execution failed" });
    }
    res.status(200).json({ output: stdout });
  });
});

// ==============================
// 🤖 Gemini AI Suggestion Endpoint
// ==============================
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/ai/suggest", async (req, res) => {
  const { code = "", language = "", message = "" } = req.body;

  if (!message && !code) {
    return res.status(400).json({ error: "Provide either message or code." });
  }

  const codeKeywords = [
    "code",
    "bug",
    "debug",
    "fix",
    "optimize",
    "review",
    "refactor",
    "error",
  ];
  const isCodeRelated = codeKeywords.some((word) =>
    message.toLowerCase().includes(word)
  );

  let prompt = "";

  if (isCodeRelated && code && language) {
    prompt = `
You are an experienced ${language} developer and a technical assistant.

The user asked:
"${message}"

Here is their code:
\`\`\`${language}
${code}
\`\`\`

Suggest improvements, identify bugs, and explain changes simply.
    `;
  } else {
    prompt = `
You are a friendly, geeky AI assistant.

User said:
"${message}"

Respond with casual, friendly help — optionally with coding jokes.
    `;
  }

  try {
    const response = await genAI.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const suggestion =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No suggestion returned.";

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Gemini AI Error:", error.message || error);
    res.status(500).json({ error: "Failed to generate AI suggestion" });
  }
});

// ==============================
// 🧑‍🤝‍🧑 Realtime Collaboration via Socket.IO
// ==============================
const rooms = {};
const roomCode = {};
const roomLanguage = {};

io.on("connection", (socket) => {
  console.log(`🟢 Connected: ${socket.id}`);

  socket.on("join", ({ roomId, username }) => {
    socket.join(roomId);
    socket.currentRoom = roomId;
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push({ socketId: socket.id, username });
    io.to(roomId).emit("user-list", rooms[roomId]);
  });

  socket.on("code-change", ({ roomId, code }) => {
    roomCode[roomId] = code;
    socket.to(roomId).emit("code-change", code);
  });

  socket.on("leave-room", ({ roomId }, cb) => {
    socket.leave(roomId);
    rooms[roomId] = rooms[roomId].filter((u) => u.socketId !== socket.id);
    io.to(roomId).emit("user-list", rooms[roomId]);
    if (rooms[roomId].length === 0) delete rooms[roomId];
    cb?.();
  });

  socket.on("language-change", ({ roomId, language }) => {
    roomLanguage[roomId] = language;
    socket.to(roomId).emit("language-change", language);
  });

  socket.on("request-sync", ({ roomId }) => {
    socket.emit("code-change", roomCode[roomId] || "");
    socket.emit("language-change", roomLanguage[roomId] || "javascript");
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      rooms[room] = rooms[room].filter((u) => u.socketId !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
      else io.to(room).emit("user-list", rooms[room]);
    }
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

// ==============================
// 🌐 Serve React Frontend (client/dist)
// ==============================
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// ==============================
// 🚀 Start Server
// ==============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
