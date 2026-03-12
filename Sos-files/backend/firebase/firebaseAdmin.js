// ============================================================
//  PET SOS — Firebase Admin SDK (Backend)
//  File: firebase/firebaseAdmin.js
//  Initializes Admin SDK once; exports db, bucket, messaging
// ============================================================

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential:    admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db        = admin.firestore();
const bucket    = admin.storage().bucket();
const messaging = admin.messaging();

module.exports = { admin, db, bucket, messaging };
