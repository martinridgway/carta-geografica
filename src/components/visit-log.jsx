import React, { useState } from "react";

import { addVisit, removeVisit } from "../services/locations";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function VisitLog({
  location,
  readOnly = false,
  pendingPin,
  pinPickerActive,
  onStartPinPicker,
  onClearPin
}) {
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  if (!location) {
    return null;
  }

  const visits = location.visits || [];
  const sorted = [...visits].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (readOnly && !sorted.length) {
    return null;
  }

  const handleSubmit = event => {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    addVisit(location.id, {
      date,
      note: note.trim(),
      pin: pendingPin || undefined
    });
    setNote("");
    onClearPin?.();
  };

  const pinLabel = pendingPin
    ? "Pin set"
    : pinPickerActive
    ? "Click the map…"
    : "Pin a spot";

  return (
    <div className="visit-log">
      {Boolean(sorted.length) && (
        <ul className="visit-log__entries">
          {sorted.map(visit => (
            <li key={visit.id} className="visit-log__entry">
              <span className="visit-log__date">{formatDate(visit.date)}</span>
              {visit.pin && (
                <span
                  className="visit-log__pin-dot"
                  title="Pinned on the map"
                />
              )}
              <span className="visit-log__note">{visit.note}</span>
              {!readOnly && (
                <button
                  type="button"
                  className="visit-log__remove"
                  aria-label="Remove memory"
                  onClick={() => removeVisit(location.id, visit.id)}
                >
                  &times;
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!readOnly && (
        <form className="visit-log__form" onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
          />
          <input
            type="text"
            placeholder="Add a memory..."
            value={note}
            onChange={event => setNote(event.target.value)}
          />
          <button
            type="button"
            className={`visit-log__pin-toggle${
              pendingPin ? " visit-log__pin-toggle--set" : ""
            }${pinPickerActive ? " visit-log__pin-toggle--active" : ""}`}
            onClick={() =>
              pendingPin || pinPickerActive
                ? onClearPin?.()
                : onStartPinPicker?.()
            }
          >
            {pinLabel}
          </button>
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default VisitLog;
