import React, { useState, useEffect, useCallback, useRef } from "react";

import Map from "./map";
import Panel from "./panel";
import SearchBox from "./search";
import ShieldButton from "./shield-button";
import SaveButton from "./save-button";
import LocationList from "./location-list";
import { geocodeAddress, placeTitle } from "../services/geocode";

const DEFAULT_LOCATION = "Boston, MA";
const SHIELD_CAST_ENABLED = import.meta.env.VITE_ENABLE_SHIELD_CAST === "true";

function ControlView() {
  const [address, setAddress] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  const search = useCallback(async query => {
    setLoading(true);

    try {
      const result = await geocodeAddress(query);
      setAddress(result.address);
      setLat(result.lat);
      setLon(result.lon);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectSavedLocation = useCallback(location => {
    setAddress(location.address);
    setLat(location.lat);
    setLon(location.lon);
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

  return (
    <div className="app-wrapper">
      {coordinatesAreAvailable && <Map ref={mapRef} lon={lon} lat={lat} />}
      <Panel {...address} lon={lon} lat={lat} />
      <SearchBox onSearch={search} disabled={loading} />
      <SaveButton
        address={address}
        lat={lat}
        lon={lon}
        disabled={!coordinatesAreAvailable}
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
