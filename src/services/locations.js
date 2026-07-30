const STORAGE_KEY = "carta-geografica:locations";
const CHANGE_EVENT = "locations-changed";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getLocations() {
  return read();
}

export function saveLocation({ address, lat, lon }) {
  const location = {
    id: crypto.randomUUID(),
    address,
    lat,
    lon,
    savedAt: new Date().toISOString()
  };

  write([...read(), location]);

  return location;
}

export function removeLocation(id) {
  write(read().filter(location => location.id !== id));
}

export function addVisit(locationId, { date, note, pin }) {
  const visit = {
    id: crypto.randomUUID(),
    date,
    note,
    ...(pin ? { pin } : {}),
    addedAt: new Date().toISOString()
  };

  write(
    read().map(location =>
      location.id === locationId
        ? { ...location, visits: [...(location.visits || []), visit] }
        : location
    )
  );

  return visit;
}

export function removeVisit(locationId, visitId) {
  write(
    read().map(location =>
      location.id === locationId
        ? {
            ...location,
            visits: (location.visits || []).filter(
              visit => visit.id !== visitId
            )
          }
        : location
    )
  );
}

export function subscribeToLocations(callback) {
  const handleStorage = event => {
    if (!event.key || event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}
