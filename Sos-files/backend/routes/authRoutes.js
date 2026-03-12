// ============================================================
//  PET SOS — Auth Routes
//  File: routes/authRoutes.js
//  FCM token registration/removal for push notifications
// ============================================================

const express     = require("express");
const { db }      = require("../firebase/firebaseAdmin");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// POST /api/auth/register-token  —  save FCM token after login
router.post("/register-token", verifyToken, async (req, res) => {
  const { fcmToken } = req.body;
  const { uid }      = req.user;

  if (!fcmToken) return res.status(400).json({ error: "fcmToken is required." });

  try {
    await db.collection("fcm_tokens").doc(uid).set(
      { uid, token: fcmToken, updatedAt: new Date() },
      { merge: true }
    );
    return res.json({ message: "FCM token registered." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register token." });
  }
});

// DELETE /api/auth/remove-token  —  remove FCM token on logout
router.delete("/remove-token", verifyToken, async (req, res) => {
  try {
    await db.collection("fcm_tokens").doc(req.user.uid).delete();
    return res.json({ message: "FCM token removed." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to remove token." });
  }
});

module.exports = router;
