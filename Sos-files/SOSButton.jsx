// ============================================================
//  PET SOS — SOS Button Component
//  File: src/components/SOSButton.jsx
//  The large orange "LOST PET ?" trigger button
// ============================================================

import React, { useState } from "react";

const SOSButton = ({ onClick }) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200); // pulse animation reset
    onClick();
  };

  return (
    <button
      className={`sos-button ${pressed ? "sos-button--pressed" : ""}`}
      onClick={handlePress}
      aria-label="Report a lost pet"
    >
      {/* Siren icon inside white circle */}
      <div className="sos-siren-circle">
        <span role="img" aria-label="siren">🚨</span>
      </div>

      <span className="sos-label">LOST PET ?</span>
    </button>
  );
};

export default SOSButton;

/*
── CSS (add to your stylesheet) ────────────────────────────────

.sos-button {
  width: 120px;
  height: 120px;
  background: #ff6b00;
  border: none;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(200, 60, 0, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.sos-button:hover {
  transform: scale(1.04);
  box-shadow: 0 12px 32px rgba(200, 60, 0, 0.5);
}

.sos-button--pressed {
  transform: scale(0.95);
  box-shadow: 0 4px 12px rgba(200, 60, 0, 0.3);
}

.sos-siren-circle {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.sos-label {
  font-size: 13px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1.5px;
}
*/
