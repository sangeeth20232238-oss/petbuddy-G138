// ============================================================
//  PET SOS — Main Screen Component
//  File: src/components/PetSOSScreen.jsx
//  Displays: SOS button, recent alerts feed (live via Firestore)
// ============================================================

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AlertCard   from "./AlertCard";
import SOSButton   from "./SOSButton";
import SOSModal    from "./SOSModal";

const PetSOSScreen = () => {
  const [alerts, setAlerts]       = useState([]);   // live alert feed
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Real-time listener: Firestore → alerts collection ──────────────────────
  // onSnapshot fires every time a new alert document is added or updated,
  // keeping the feed live without any manual refresh.
  useEffect(() => {
    const alertsRef = collection(db, "alerts");
    const q = query(alertsRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveAlerts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(liveAlerts);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="pet-sos-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="screen-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          ‹
        </button>
        <h1 className="screen-title">Pet SOS</h1>
      </div>

      {/* ── Hero Banner with SOS Button ────────────────────────── */}
      <div className="hero-banner">
        <div className="pets-row">
          <span className="pet-avatar">🐶</span>
          <span className="pet-avatar large">🐕</span>
          <span className="pet-avatar">🐱</span>
        </div>
        <span className="paw-icon">🐾</span>

        {/* SOSButton opens the lost-pet posting modal */}
        <SOSButton onClick={() => setModalOpen(true)} />
      </div>

      {/* ── Recent Alerts Feed ─────────────────────────────────── */}
      <section className="alerts-section">
        <h2 className="section-title">Recent Alerts</h2>

        {loading ? (
          <p className="loading-text">Loading alerts…</p>
        ) : (
          <div className="alerts-grid">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}

        <button
          className="see-all-btn"
          onClick={() => (window.location.href = "/alerts")}
        >
          See all
        </button>
      </section>

      {/* ── Lost Pet Modal ─────────────────────────────────────── */}
      {modalOpen && <SOSModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default PetSOSScreen;
