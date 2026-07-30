import React from "react";

import Map from "./map";
import { useLocations } from "../hooks/useLocations";
import { placeTitle } from "../services/geocode";

function Gallery() {
  const locations = useLocations();

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
              <Map lon={location.lon} lat={location.lat} />
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
    </div>
  );
}

export default Gallery;
