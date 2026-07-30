import React, { useState } from "react";
import { exportMapImage } from "../services/exportMap";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ShieldButton({ getMap }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState(null);

  const handleClick = async () => {
    const map = getMap();

    if (!map) {
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const blob = await exportMapImage(map);
      const response = await fetch(`${SERVER_URL}/api/screensaver/send`, {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: blob
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Server responded ${response.status}`);
      }

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div id="shield-button">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send to Shield"}
      </button>
      {status === "sent" && (
        <p className="shield-button__status">Sent!</p>
      )}
      {status === "error" && (
        <p className="shield-button__status shield-button__status--error">
          {message}
        </p>
      )}
    </div>
  );
}

export default ShieldButton;
