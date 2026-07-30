import { useEffect, useState } from "react";

import { getLocations, subscribeToLocations } from "../services/locations";

export function useLocations() {
  const [locations, setLocations] = useState(getLocations);

  useEffect(() => {
    return subscribeToLocations(() => setLocations(getLocations()));
  }, []);

  return locations;
}
