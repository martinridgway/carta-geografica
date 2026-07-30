import React from "react";

import Map from "./map";
import Panel from "./panel";
import VisitLog from "./visit-log";
import { useLocations } from "../hooks/useLocations";

function KioskView({ locationId, nav }) {
  const locations = useLocations();
  const location = locations.find(entry => entry.id === locationId);

  if (!location) {
    return (
      <div className="app-wrapper">
        {nav && (
          <a className="kiosk-view__back" href="?view=gallery">
            &larr; Gallery
          </a>
        )}
        <p className="kiosk-view__not-found">Location not found.</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Map lon={location.lon} lat={location.lat} />
      <Panel {...location.address} lon={location.lon} lat={location.lat}>
        <VisitLog location={location} readOnly={!nav} />
      </Panel>
      {nav && (
        <a className="kiosk-view__back" href="?view=gallery">
          &larr; Gallery
        </a>
      )}
    </div>
  );
}

export default KioskView;
