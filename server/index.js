import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import os from "os";
import campusRoutes from "./routes/campusRoutes.js";
import nodesRoutes from "./routes/nodesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { initializeDatabase } from "./utils/dbInit.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve physically uploaded files statically
app.use("/uploads", express.static("uploads"));

// Serve Vite compiled React frontend static files
app.use(express.static("dist"));

// Register Modular API Routes
app.use("/api/campus-info", campusRoutes);
app.use("/api/nodes", nodesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Root Hello API description endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "🤖 Welcome to UAN 360° Virtual Tour API with Sequelize & MySQL!",
    endpoints: {
      campusInfo: "/api/campus-info",
      nodes: "/api/nodes",
      auth: "/api/auth",
      upload: "/api/upload"
    }
  });
});

// Catch-all SPA router fallback (MUST be placed below API routes)
app.get("/*splat", (req, res) => {
  if (!req.url.startsWith("/api") && !req.url.startsWith("/uploads")) {
    res.sendFile(path.resolve("dist/index.html"));
  }
});

// Initialize database and start server
const startServer = async () => {
  // Sync database structure and seed initial values if empty
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`\n🤖 Express Backend server is running successfully on port ${PORT}!`);
    console.log(`   ➜ API URL: http://localhost:${PORT}/api/`);
    console.log(`   ➜ Web App URL: http://localhost:${PORT}/`);
    console.log(`   ➜ DB Type: MySQL (via Sequelize ORM)\n`);

    // Otomatis membuka browser
    try {
      const url = `http://localhost:${PORT}/`;
      const platform = os.platform();
      if (platform === 'darwin') exec(`open ${url}`);
      else if (platform === 'win32') exec(`start ${url}`);
      else exec(`xdg-open ${url}`);
    } catch (err) {
      console.log("Failed to open browser automatically.");
    }
  });
};

startServer();
