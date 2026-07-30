import React from "react";

import { useLocations } from "../hooks/useLocations";
import { removeLocation } from "../services/locations";
import { placeTitle } from "../services/geocode";

function LocationList({ onSelect }) {
  const locations = useLocations();

  if (!locations.length) {
    return null;
  }

  return (
    <ul id="location-list">
      {locations.map(location => (
        <li key={location.id}>
          <button
            type="button"
            className="location-list__item"
            onClick={() => onSelect(location)}
          >
            {placeTitle(location.address) || location.address?.state || "Untitled"}
          </button>
          <button
            type="button"
            className="location-list__remove"
            aria-label="Remove location"
            onClick={() => removeLocation(location.id)}
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  );
}

export default LocationList;
