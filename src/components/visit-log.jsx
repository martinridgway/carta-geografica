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

function VisitLog({ location, readOnly = false }) {
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

    addVisit(location.id, { date, note: note.trim() });
    setNote("");
  };

  return (
    <div className="visit-log">
      {Boolean(sorted.length) && (
        <ul className="visit-log__entries">
          {sorted.map(visit => (
            <li key={visit.id} className="visit-log__entry">
              <span className="visit-log__date">{formatDate(visit.date)}</span>
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
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default VisitLog;
