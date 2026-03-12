// ============================================================
//  PET SOS — Firebase Cloud Function
//  File: functions/index.js
//  Serverless Node.js trigger: fires on every new Firestore
//  alert document and sends FCM push notifications automatically.
//  Deploy with: firebase deploy --only functions
// ============================================================

const functions = require("firebase-functions");
const admin     = require("firebase-admin");

admin.initializeApp();

const db        = admin.firestore();
const messaging = admin.messaging();

// ─────────────────────────────────────────────────────────────
//  TRIGGER: Fires when a new document is created in /alerts/{alertId}
// ─────────────────────────────────────────────────────────────
exports.onNewLostPetAlert = functions.firestore
  .document("alerts/{alertId}")
  .onCreate(async (snap, context) => {
    const alertData = snap.data();
    const alertId   = context.params.alertId;

    const { petName, ownerName, status } = alertData;

    // Only notify for active alerts (not test docs)
    if (status !== "active") return null;

    try {
      // 1️⃣  Fetch all registered FCM tokens
      const tokensSnapshot = await db.collection("fcm_tokens").get();
      const tokens = tokensSnapshot.docs
        .map((doc) => doc.data().token)
        .filter(Boolean);

      if (tokens.length === 0) {
        console.log("No FCM tokens registered. Skipping notification.");
        return null;
      }

      // 2️⃣  Build multicast message
      const message = {
        notification: {
          title: "🚨 Lost Pet Alert Nearby!",
          body:  `${ownerName || "Someone"} lost their pet "${petName}". Tap to help!`,
          imageUrl: alertData.petPhotoURL || undefined,
        },
        data: {
          alertId,
          type:    "LOST_PET_ALERT",
          screen:  "PetSOSScreen", // deep-link target in the React app
        },
        android: {
          notification: {
            channelId: "pet_sos_alerts",
            priority:  "high",
            color:     "#FF6B00",
          },
        },
        apns: {
          payload: {
            aps: { badge: 1, sound: "default" },
          },
        },
        tokens,
      };

      // 3️⃣  Send to all devices
      const response = await messaging.sendEachForMulticast(message);

      console.log(
        `Alert ${alertId}: ${response.successCount} sent, ${response.failureCount} failed.`
      );

      // 4️⃣  Clean up stale/invalid tokens from Firestore
      const staleTokenRemovals = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            // Find and delete the stale token document
            const staleToken = tokens[idx];
            const staleDoc = tokensSnapshot.docs.find(
              (d) => d.data().token === staleToken
            );
            if (staleDoc) {
              staleTokenRemovals.push(staleDoc.ref.delete());
            }
          }
        }
      });

      await Promise.all(staleTokenRemovals);
      console.log(`Removed ${staleTokenRemovals.length} stale tokens.`);

      return null;

    } catch (err) {
      console.error("onNewLostPetAlert error:", err.message);
      return null;
    }
  });

// ─────────────────────────────────────────────────────────────
//  TRIGGER: Scheduled cleanup — archive alerts older than 30 days
// ─────────────────────────────────────────────────────────────
exports.archiveOldAlerts = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldAlerts = await db
      .collection("alerts")
      .where("status", "==", "active")
      .where("createdAt", "<", thirtyDaysAgo)
      .get();

    const batch = db.batch();
    oldAlerts.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "archived" });
    });

    await batch.commit();
    console.log(`Archived ${oldAlerts.size} old alerts.`);
    return null;
  });
