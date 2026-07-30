import React, { useState, useCallback } from "react";

import Map from "./map";
import Panel from "./panel";
import VisitLog from "./visit-log";
import { useLocations } from "../hooks/useLocations";

function KioskView({ locationId, nav }) {
  const locations = useLocations();
  const location = locations.find(entry => entry.id === locationId);
  const [pendingPin, setPendingPin] = useState(null);
  const [pinPickerActive, setPinPickerActive] = useState(false);

  const clearPin = useCallback(() => {
    setPendingPin(null);
    setPinPickerActive(false);
  }, []);

  const handleMapClick = useCallback((clickLon, clickLat) => {
    setPendingPin({ lon: clickLon, lat: clickLat });
    setPinPickerActive(false);
  }, []);

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

  const editable = Boolean(nav);

  const savedPins = (location.visits || [])
    .filter(visit => visit.pin)
    .map(visit => ({
      id: visit.id,
      lon: visit.pin.lon,
      lat: visit.pin.lat,
      note: visit.note
    }));
  const pins =
    editable && pendingPin
      ? [
          ...savedPins,
          { id: "pending", lon: pendingPin.lon, lat: pendingPin.lat, pending: true }
        ]
      : savedPins;

  return (
    <div className="app-wrapper">
      <Map
        lon={location.lon}
        lat={location.lat}
        pins={pins}
        onMapClick={editable && pinPickerActive ? handleMapClick : undefined}
        picking={editable && pinPickerActive}
      />
      <Panel {...location.address} lon={location.lon} lat={location.lat}>
        <VisitLog
          location={location}
          readOnly={!editable}
          pendingPin={editable ? pendingPin : null}
          pinPickerActive={editable && pinPickerActive}
          onStartPinPicker={editable ? () => setPinPickerActive(true) : undefined}
          onClearPin={editable ? clearPin : undefined}
        />
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
