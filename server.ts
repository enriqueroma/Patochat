import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Store active users and room config
  const activeUsers = new Map();
  let roomConfig = {
    maxUsers: 3,
    characters: [
      { id: '1', name: 'Hugo', color: '#ef4444', bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hover: 'hover:bg-red-600' },
      { id: '2', name: 'Paco', color: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hover: 'hover:bg-blue-600' },
      { id: '3', name: 'Luis', color: '#22c55e', bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', hover: 'hover:bg-green-600' },
    ]
  };

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send current config to new user
    socket.emit("room_config", roomConfig);

    socket.on("update_config", (newConfig) => {
      roomConfig = newConfig;
      io.emit("room_config", roomConfig);
      console.log("Room config updated");
    });

    socket.on("join", (characterId) => {
      activeUsers.set(socket.id, characterId);
      io.emit("user_list", Array.from(activeUsers.values()));
      console.log(`${characterId} joined`);
    });

    socket.on("message", (data) => {
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      const characterId = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);
      io.emit("user_list", Array.from(activeUsers.values()));
      console.log(`${characterId} disconnected`);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
