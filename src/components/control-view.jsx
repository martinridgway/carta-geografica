import React, { useState, useEffect, useCallback, useRef } from "react";

import Map from "./map";
import Panel from "./panel";
import SearchBox from "./search";
import ShieldButton from "./shield-button";
import SaveButton from "./save-button";
import LocationList from "./location-list";
import VisitLog from "./visit-log";
import { geocodeAddress, placeTitle } from "../services/geocode";
import { useLocations } from "../hooks/useLocations";

const DEFAULT_LOCATION = "Boston, MA";
const SHIELD_CAST_ENABLED = import.meta.env.VITE_ENABLE_SHIELD_CAST === "true";

function ControlView() {
  const [address, setAddress] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [pendingPin, setPendingPin] = useState(null);
  const [pinPickerActive, setPinPickerActive] = useState(false);
  const mapRef = useRef(null);
  const locations = useLocations();
  const currentLocation =
    locations.find(location => location.id === currentLocationId) || null;

  const clearPin = useCallback(() => {
    setPendingPin(null);
    setPinPickerActive(false);
  }, []);

  const search = useCallback(
    async query => {
      setLoading(true);

      try {
        const result = await geocodeAddress(query);
        setAddress(result.address);
        setLat(result.lat);
        setLon(result.lon);
        setCurrentLocationId(null);
        clearPin();
      } finally {
        setLoading(false);
      }
    },
    [clearPin]
  );

  const selectSavedLocation = useCallback(
    location => {
      setAddress(location.address);
      setLat(location.lat);
      setLon(location.lon);
      setCurrentLocationId(location.id);
      clearPin();
    },
    [clearPin]
  );

  const handleSaved = useCallback(location => {
    setCurrentLocationId(location.id);
  }, []);

  const handleMapClick = useCallback((clickLon, clickLat) => {
    setPendingPin({ lon: clickLon, lat: clickLat });
    setPinPickerActive(false);
  }, []);

  useEffect(() => {
    search(DEFAULT_LOCATION);
  }, [search]);

  useEffect(() => {
    const title = placeTitle(address);

    if (!title) {
      return;
    }

    document.title = `A map of ${title}`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = `A map of ${title}`;
  }, [address]);

  const coordinatesAreAvailable = Boolean(lat && lon);

  const savedPins = currentLocation
    ? (currentLocation.visits || [])
        .filter(visit => visit.pin)
        .map(visit => ({
          id: visit.id,
          lon: visit.pin.lon,
          lat: visit.pin.lat,
          note: visit.note
        }))
    : [];
  const pins = pendingPin
    ? [
        ...savedPins,
        { id: "pending", lon: pendingPin.lon, lat: pendingPin.lat, pending: true }
      ]
    : savedPins;

  return (
    <div className="app-wrapper">
      {coordinatesAreAvailable && (
        <Map
          ref={mapRef}
          lon={lon}
          lat={lat}
          pins={pins}
          onMapClick={pinPickerActive ? handleMapClick : undefined}
          picking={pinPickerActive}
        />
      )}
      <Panel {...address} lon={lon} lat={lat}>
        {currentLocation && (
          <VisitLog
            location={currentLocation}
            pendingPin={pendingPin}
            pinPickerActive={pinPickerActive}
            onStartPinPicker={() => setPinPickerActive(true)}
            onClearPin={clearPin}
          />
        )}
      </Panel>
      <SearchBox onSearch={search} disabled={loading} />
      <SaveButton
        address={address}
        lat={lat}
        lon={lon}
        disabled={!coordinatesAreAvailable}
        onSaved={handleSaved}
      />
      <LocationList onSelect={selectSavedLocation} />
      <a id="gallery-link" href="?view=gallery">
        Gallery view
      </a>
      {SHIELD_CAST_ENABLED && (
        <ShieldButton getMap={() => mapRef.current?.getOlMap()} />
      )}
    </div>
  );
}

export default ControlView;
