import React, { useState, useCallback } from "react";

import Map from "./map";
import Panel from "./panel";
import VisitLog from "./visit-log";
import MemoryModal from "./memory-modal";
import { photoSrc } from "../services/photos";
import { useLocations } from "../hooks/useLocations";

function KioskView({ locationId, nav }) {
  const locations = useLocations();
  const location = locations.find(entry => entry.id === locationId);
  const [pendingPin, setPendingPin] = useState(null);
  const [pinPickerActive, setPinPickerActive] = useState(false);
  const [openVisit, setOpenVisit] = useState(null);

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
      note: visit.note,
      thumbUrl: visit.photos?.[0] ? photoSrc(visit.photos[0].url) : undefined,
      visit
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
        onPinClick={pin => setOpenVisit(pin.visit)}
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
          onOpenVisit={setOpenVisit}
        />
      </Panel>
      {nav && (
        <a className="kiosk-view__back" href="?view=gallery">
          &larr; Gallery
        </a>
      )}
      {openVisit && (
        <MemoryModal visit={openVisit} onClose={() => setOpenVisit(null)} />
      )}
    </div>
  );
}

export default KioskView;
