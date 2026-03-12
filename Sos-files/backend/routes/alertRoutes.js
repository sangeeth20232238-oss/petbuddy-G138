// ============================================================
//  PET SOS — Alert Routes
//  File: routes/alertRoutes.js
//  All routes protected by verifyToken (applied in server.js)
// ============================================================

const express         = require("express");
const multer          = require("multer");
const alertController = require("../controllers/alertController");

const router = express.Router();

// Multer: in-memory storage, 5 MB max, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG / PNG / WebP allowed"), false);
  },
});

// ── CRUD ───────────────────────────────────────────────────
// GET    /api/alerts            → paginated list of active alerts
router.get("/",    alertController.getAlerts);

// GET    /api/alerts/:id        → single alert by Firestore ID
router.get("/:id", alertController.getAlertById);

// POST   /api/alerts            → create lost-pet alert (with photo)
router.post("/",   upload.single("petPhoto"), alertController.createAlert);

// PATCH  /api/alerts/:id/like   → increment like count (atomic)
router.patch("/:id/like", alertController.likeAlert);

// PATCH  /api/alerts/:id/status → mark as found / close
router.patch("/:id/status", alertController.updateStatus);

// DELETE /api/alerts/:id        → soft-delete (owner only)
router.delete("/:id", alertController.deleteAlert);

module.exports = router;
