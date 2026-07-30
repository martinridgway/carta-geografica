import React, { useRef, useState } from "react";

import { addVisit, addPhotosToVisit, removeVisit } from "../services/locations";
import { PHOTOS_ENABLED, photoSrc, uploadPhotos } from "../services/photos";

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
  onClearPin,
  onOpenVisit
}) {
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleSubmit = async event => {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    const visit = addVisit(location.id, {
      date,
      note: note.trim(),
      pin: pendingPin || undefined
    });

    setNote("");
    onClearPin?.();
    setPhotoError(null);

    const files = fileInputRef.current?.files;

    if (files?.length) {
      setUploading(true);

      try {
        const urls = await uploadPhotos(location.id, visit.id, files);
        addPhotosToVisit(location.id, visit.id, urls);
      } catch (err) {
        setPhotoError(err.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
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
              {PHOTOS_ENABLED && Boolean(visit.photos?.length) && (
                <button
                  type="button"
                  className="visit-log__photo-chip"
                  onClick={() => onOpenVisit?.(visit)}
                  aria-label={`View ${visit.photos.length} photo${
                    visit.photos.length > 1 ? "s" : ""
                  }`}
                >
                  <img src={photoSrc(visit.photos[0].url)} alt="" />
                  {visit.photos.length > 1 && (
                    <span className="visit-log__photo-count">
                      +{visit.photos.length - 1}
                    </span>
                  )}
                </button>
              )}
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
          {PHOTOS_ENABLED && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="visit-log__photo-input"
              title="Attach photos"
            />
          )}
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
          <button type="submit" disabled={uploading}>
            {uploading ? "Adding…" : "Add"}
          </button>
        </form>
      )}
      {photoError && <p className="visit-log__photo-error">{photoError}</p>}
    </div>
  );
}

export default VisitLog;
