import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import os from "os";
import campusRoutes from "./routes/campusRoutes.js";
import nodesRoutes from "./routes/nodesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initializeDatabase } from "./utils/dbInit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// Core middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically (always)
app.use("/uploads", express.static(path.join(ROOT, "uploads")));

// ─── API Routes (must come before SPA fallback) ──────────────────────────────
app.use("/api/campus-info", campusRoutes);
app.use("/api/nodes", nodesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

app.get("/api", (_req, res) => {
  res.json({
    message: "🤖 Virtual Campus Tour API (Sequelize + MySQL)",
    endpoints: { campusInfo: "/api/campus-info", nodes: "/api/nodes", auth: "/api/auth", upload: "/api/upload" },
  });
});

// ─── Initialize DB then start server ─────────────────────────────────────────
const startServer = async () => {
  await initializeDatabase();

  if (isDev) {
    // ── DEV: Vite runs as Express middleware — single port, full HMR ──────────
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: ROOT,
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Vite middleware handles all asset / HMR requests
    app.use(vite.middlewares);

    // SPA fallback: serve Vite-transformed index.html for unknown routes
    app.use((req, res, next) => {
      if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
        return next();
      }
      const indexPath = path.join(ROOT, "index.html");
      fs.readFile(indexPath, "utf-8", async (err, template) => {
        if (err) return next(err);
        try {
          const html = await vite.transformIndexHtml(req.url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
    });

  } else {
    // ── PRODUCTION: serve built dist/ statically ──────────────────────────────
    const distPath = path.join(ROOT, "dist");
    app.use(express.static(distPath));

    // SPA fallback for all frontend routes
    app.use((req, res, next) => {
      if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    const mode = isDev ? "DEV + HMR" : "PRODUCTION";
    console.log(`\n🤖 Server berjalan pada port ${PORT} [${mode}]`);
    console.log(`   ➜ Web App : http://localhost:${PORT}/`);
    console.log(`   ➜ API URL : http://localhost:${PORT}/api/`);
    console.log(`   ➜ DB      : MySQL (via Sequelize ORM)\n`);

    if (isDev) {
      try {
        const url = `http://localhost:${PORT}/`;
        const platform = os.platform();
        if (platform === "darwin") exec(`open ${url}`);
        else if (platform === "win32") exec(`start ${url}`);
        else exec(`xdg-open ${url}`);
      } catch { /* ignore */ }
    }
  });
};

startServer();
