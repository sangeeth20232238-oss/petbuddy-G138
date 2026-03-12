// ============================================================
//  PET SOS — Alert Controller
//  File: controllers/alertController.js
//  Handles: Storage upload → Firestore write → FCM push
// ============================================================

const { db, bucket, messaging } = require("../firebase/firebaseAdmin");
const { v4: uuidv4 }            = require("uuid");
const { FieldValue }            = require("firebase-admin/firestore");

// ─────────────────────────────────────────────────────────────
//  POST /api/alerts  —  Create new lost-pet SOS alert
// ─────────────────────────────────────────────────────────────
exports.createAlert = async (req, res) => {
  try {
    const { petName, description, dateLost } = req.body;
    const { uid, name: ownerName, email }     = req.user;

    if (!petName || !dateLost) {
      return res.status(400).json({ error: "petName and dateLost are required." });
    }

    // 1️⃣  Upload photo to Firebase Storage
    let petPhotoURL = null;
    if (req.file) {
      const filename   = `alerts/${uid}/${uuidv4()}_${req.file.originalname}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });
      await fileUpload.makePublic();
      petPhotoURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    // 2️⃣  Write alert document to Firestore
    const alertData = {
      ownerId:     uid,
      ownerName:   ownerName || email || "Unknown",
      petName,
      description: description || `This is my Lost Pet named ${petName}!`,
      dateLost:    new Date(dateLost).toISOString(),
      petPhotoURL,
      likes:       0,
      comments:    0,
      status:      "active",
      createdAt:   FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("alerts").add(alertData);

    // 3️⃣  Push FCM notification to all subscribed users
    await _sendPushNotification(petName, ownerName, docRef.id);

    return res.status(201).json({ message: "Alert created", alertId: docRef.id, ...alertData });

  } catch (err) {
    console.error("createAlert:", err.message);
    return res.status(500).json({ error: "Failed to create alert." });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/alerts  —  Paginated list of active alerts
// ─────────────────────────────────────────────────────────────
exports.getAlerts = async (req, res) => {
  try {
    const pageSize = Math.min(parseInt(req.query.limit) || 20, 50);

    const snapshot = await db
      .collection("alerts")
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .limit(pageSize)
      .get();

    const alerts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ count: alerts.length, alerts });

  } catch (err) {
    console.error("getAlerts:", err.message);
    return res.status(500).json({ error: "Failed to fetch alerts." });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/alerts/:id  —  Single alert
// ─────────────────────────────────────────────────────────────
exports.getAlertById = async (req, res) => {
  try {
    const doc = await db.collection("alerts").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Alert not found." });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("getAlertById:", err.message);
    return res.status(500).json({ error: "Failed to fetch alert." });
  }
};

// ─────────────────────────────────────────────────────────────
//  PATCH /api/alerts/:id/like  —  Atomic like increment
// ─────────────────────────────────────────────────────────────
exports.likeAlert = async (req, res) => {
  try {
    const ref = db.collection("alerts").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Alert not found." });

    await ref.update({ likes: FieldValue.increment(1) });
    return res.json({ message: "Liked!", likes: doc.data().likes + 1 });

  } catch (err) {
    console.error("likeAlert:", err.message);
    return res.status(500).json({ error: "Failed to like alert." });
  }
};

// ─────────────────────────────────────────────────────────────
//  PATCH /api/alerts/:id/status  —  Update alert status
//  Body: { status: "found" | "closed" | "active" }
// ─────────────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed    = ["active", "found", "closed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}` });
    }

    const ref = db.collection("alerts").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Alert not found." });

    // Only owner can update status
    if (doc.data().ownerId !== req.user.uid) {
      return res.status(403).json({ error: "Only the owner can update this alert." });
    }

    await ref.update({ status, updatedAt: FieldValue.serverTimestamp() });
    return res.json({ message: `Alert marked as ${status}.` });

  } catch (err) {
    console.error("updateStatus:", err.message);
    return res.status(500).json({ error: "Failed to update status." });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE /api/alerts/:id  —  Soft-delete (owner only)
// ─────────────────────────────────────────────────────────────
exports.deleteAlert = async (req, res) => {
  try {
    const ref = db.collection("alerts").doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists)                            return res.status(404).json({ error: "Alert not found." });
    if (doc.data().ownerId !== req.user.uid)    return res.status(403).json({ error: "Not your alert." });

    await ref.update({ status: "closed", closedAt: FieldValue.serverTimestamp() });
    return res.json({ message: "Alert closed." });

  } catch (err) {
    console.error("deleteAlert:", err.message);
    return res.status(500).json({ error: "Failed to delete alert." });
  }
};

// ─────────────────────────────────────────────────────────────
//  PRIVATE: send FCM multicast to all registered token holders
// ─────────────────────────────────────────────────────────────
async function _sendPushNotification(petName, ownerName, alertId) {
  try {
    const snap   = await db.collection("fcm_tokens").get();
    const tokens = snap.docs.map((d) => d.data().token).filter(Boolean);
    if (!tokens.length) return;

    await messaging.sendEachForMulticast({
      notification: {
        title: "🚨 Lost Pet Alert!",
        body:  `${ownerName} lost their pet "${petName}". Can you help?`,
      },
      data:   { alertId, type: "LOST_PET_ALERT", screen: "RecentAlertsScreen" },
      tokens,
    });
  } catch (err) {
    console.error("FCM error (non-fatal):", err.message);
  }
}
