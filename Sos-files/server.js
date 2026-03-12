// ============================================================
//  PET SOS — Node.js Backend Server
//  File: server.js
//  Express app: CORS, security, route mounting, error handling
// ============================================================

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
require("dotenv").config();

const alertRoutes = require("./routes/alertRoutes");
const authRoutes  = require("./routes/authRoutes");
const verifyToken = require("./middleware/verifyToken");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ──────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",   authRoutes);                   // public
app.use("/api/alerts", verifyToken, alertRoutes);     // protected

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "OK", service: "Pet SOS API", time: new Date() })
);

// ── 404 ────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ── Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`🐾 Pet SOS API running → http://localhost:${PORT}`)
);

module.exports = app;
