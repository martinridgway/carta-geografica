import React, { useState } from "react";

import { saveLocation } from "../services/locations";

function SaveButton({ address, lat, lon, disabled, onSaved }) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    const location = saveLocation({ address, lat, lon });
    onSaved?.(location);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="save-button">
      <button type="button" onClick={handleClick} disabled={disabled}>
        Save location
      </button>
      {saved && <p className="save-button__status">Saved!</p>}
    </div>
  );
}

export default SaveButton;
