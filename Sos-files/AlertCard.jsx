// ============================================================
//  PET SOS — Alert Card Component
//  File: src/components/AlertCard.jsx
//  Displays a single lost-pet alert in the feed
// ============================================================

import React, { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AlertCard = ({ alert }) => {
  const {
    id,
    ownerName,
    petName,
    petPhotoURL,
    dateLost,
    likes = 0,
    description,
  } = alert;

  const [liked, setLiked] = useState(false);

  // ── Optimistic like update → Firestore ────────────────────
  const handleLike = async () => {
    if (liked) return; // prevent double-like
    setLiked(true);
    try {
      await updateDoc(doc(db, "alerts", id), {
        likes: increment(1),
      });
    } catch (err) {
      console.error("Like failed:", err);
      setLiked(false); // rollback optimistic update
    }
  };

  // Format date for display: "11.10.2025"
  const formattedDate = dateLost
    ? new Date(dateLost).toLocaleDateString("en-GB").replace(/\//g, ".")
    : "Unknown";

  return (
    <div className="alert-card">
      {/* Owner row */}
      <div className="alert-card__header">
        <div className="alert-card__owner">
          <span className="owner-icon">👤</span>
          <span className="owner-name">{ownerName || "Unknown Owner"}</span>
        </div>
        <button
          className={`like-btn ${liked ? "like-btn--active" : ""}`}
          onClick={handleLike}
          aria-label="Like this alert"
        >
          ❤️ {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
        </button>
      </div>

      {/* Pet description */}
      <p className="alert-card__title">
        {description || `This is my Lost Pet named ${petName}!`}
      </p>

      {/* Pet photo */}
      <img
        src={petPhotoURL || "/placeholder-pet.png"}
        alt={`Lost pet: ${petName}`}
        className="alert-card__photo"
        onError={(e) => (e.target.src = "/placeholder-pet.png")}
      />

      {/* Date lost */}
      <p className="alert-card__date">
        <strong>Date Lost :</strong> {formattedDate}
      </p>
    </div>
  );
};

export default AlertCard;
