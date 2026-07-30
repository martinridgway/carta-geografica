import React, { useEffect, useState } from "react";

import { photoSrc } from "../services/photos";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function MemoryModal({ visit, onClose }) {
  const photos = visit.photos || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKey = event => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        setActiveIndex(index => Math.min(index + 1, photos.length - 1));
      } else if (event.key === "ArrowLeft") {
        setActiveIndex(index => Math.max(index - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, photos.length]);

  return (
    <div className="memory-modal-backdrop" onClick={onClose}>
      <div className="memory-modal" onClick={event => event.stopPropagation()}>
        <button
          type="button"
          className="memory-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <p className="memory-modal__date">{formatDate(visit.date)}</p>
        {visit.note && <p className="memory-modal__note">{visit.note}</p>}
        {Boolean(photos.length) && (
          <>
            <div className="memory-modal__main-photo">
              <img src={photoSrc(photos[activeIndex].url)} alt="" />
            </div>
            {photos.length > 1 && (
              <div className="memory-modal__thumbs">
                {photos.map((photo, index) => (
                  <button
                    type="button"
                    key={photo.id}
                    className={`memory-modal__thumb${
                      index === activeIndex ? " memory-modal__thumb--active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img src={photoSrc(photo.url)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MemoryModal;
