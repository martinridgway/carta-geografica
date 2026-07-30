import React, { useState } from "react";

import Map from "./map";
import MemoryModal from "./memory-modal";
import { useLocations } from "../hooks/useLocations";
import { placeTitle } from "../services/geocode";
import { photoSrc } from "../services/photos";

function Gallery() {
  const locations = useLocations();
  const [openVisit, setOpenVisit] = useState(null);

  return (
    <div id="gallery-page">
      <a className="gallery__back" href="/">
        &larr; Back
      </a>
      {!locations.length ? (
        <p className="gallery--empty">No saved locations yet.</p>
      ) : (
        <div id="gallery">
          {locations.map(location => (
            <div className="gallery__card" key={location.id}>
              <Map
                lon={location.lon}
                lat={location.lat}
                pins={(location.visits || [])
                  .filter(visit => visit.pin)
                  .map(visit => ({
                    id: visit.id,
                    lon: visit.pin.lon,
                    lat: visit.pin.lat,
                    note: visit.note,
                    thumbUrl: visit.photos?.[0]
                      ? photoSrc(visit.photos[0].url)
                      : undefined,
                    visit
                  }))}
                onPinClick={pin => setOpenVisit(pin.visit)}
              />
              <div className="gallery__footer">
                <p className="gallery__label">
                  {placeTitle(location.address) ||
                    location.address?.state ||
                    "Untitled"}
                </p>
                <div className="gallery__links">
                  <a href={`?location=${location.id}&nav=1`}>Full map</a>
                  <a href={`?location=${location.id}`}>Chromeless</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {openVisit && (
        <MemoryModal visit={openVisit} onClose={() => setOpenVisit(null)} />
      )}
    </div>
  );
}

export default Gallery;
