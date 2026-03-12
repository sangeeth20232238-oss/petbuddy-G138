// ============================================================
//  PET SOS — Auth Middleware
//  File: middleware/verifyToken.js
//  Verifies Firebase ID token; attaches req.user for controllers
// ============================================================

const { admin } = require("../firebase/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: no token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(header.split("Bearer ")[1]);
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || "User" };
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    return res.status(403).json({ error: "Forbidden: invalid token" });
  }
};

module.exports = verifyToken;
