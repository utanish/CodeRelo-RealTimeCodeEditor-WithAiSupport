import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjected from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), cssInjected()],
  server: {
    proxy: {
      // For code execution
      "/run": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      // For Gemini AI Suggestion API
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      // For WebSocket connection
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
