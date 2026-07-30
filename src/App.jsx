import React, { useState, useEffect, useCallback, useRef } from "react";

import Map from "./components/map";
import Panel from "./components/panel";
import SearchBox from "./components/search";
import ShieldButton from "./components/shield-button";
import { geocodeAddress } from "./services/geocode";

const DEFAULT_LOCATION = "Boston, MA";
const SHIELD_CAST_ENABLED = import.meta.env.VITE_ENABLE_SHIELD_CAST === "true";

function App() {
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

  useEffect(() => {
    search(DEFAULT_LOCATION);
  }, [search]);

  useEffect(() => {
    if (!address) {
      return;
    }

    const place = address.city || address.town || address.village;
    const title = [place, address.state].filter(Boolean).join(", ");

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
      {SHIELD_CAST_ENABLED && (
        <ShieldButton getMap={() => mapRef.current?.getOlMap()} />
      )}
    </div>
  );
}

export default App;
