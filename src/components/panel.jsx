import React from "react";
import { toStringHDMS } from "ol/coordinate";

function Panel({ lon, lat, city, town, village, state, children }) {
  const place = city || town || village;
  const centerDegrees =
    lon != null && lat != null ? toStringHDMS([lon, lat], 1) : null;

  return (
    <div id="title-panel">
      <h1 className="map-title" id="map-title">
        {place}
      </h1>
      <h2 className="map-subtitle" id="map-subtitle">
        {state}
      </h2>
      <hr />
      <h3 className="map-tagline" id="map-tagline">
        {centerDegrees}
      </h3>
      {children}
    </div>
  );
}

export default Panel;
