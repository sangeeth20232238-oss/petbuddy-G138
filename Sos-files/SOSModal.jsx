// ============================================================
//  PET SOS — Lost Pet Modal / Form
//  File: src/components/SOSModal.jsx
//  Collects pet info + photo, sends to Node.js backend API
// ============================================================

import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";

const SOSModal = ({ onClose }) => {
  const [form, setForm] = useState({
    petName:     "",
    description: "",
    dateLost:    "",
  });
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");

  // ── Handle text field changes ──────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Handle photo selection & preview ──────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ── Submit: send multipart form to Node.js API ─────────────
  // The backend handles Firebase Storage upload + Firestore write
  const handleSubmit = async () => {
    if (!form.petName || !form.dateLost) {
      setError("Pet name and date lost are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Get Firebase Auth token so the backend can verify the user
      const token = await auth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append("petName",     form.petName);
      formData.append("description", form.description);
      formData.append("dateLost",    form.dateLost);
      if (photoFile) formData.append("petPhoto", photoFile);

      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Server error. Please try again.");

      onClose(); // close modal on success; Firestore listener auto-updates feed
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">🐾 Report Lost Pet</h2>

        {error && <p className="modal-error">{error}</p>}

        <label className="modal-label">
          Pet Name *
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
            placeholder="e.g. Goldy"
            className="modal-input"
          />
        </label>

        <label className="modal-label">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Any details that help identify your pet…"
            className="modal-textarea"
            rows={3}
          />
        </label>

        <label className="modal-label">
          Date Lost *
          <input
            type="date"
            name="dateLost"
            value={form.dateLost}
            onChange={handleChange}
            className="modal-input"
          />
        </label>

        <label className="modal-label">
          Pet Photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="modal-file"
          />
        </label>

        {photoPreview && (
          <img
            src={photoPreview}
            alt="Pet preview"
            className="modal-preview"
          />
        )}

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Posting…" : "🚨 Send Alert"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
