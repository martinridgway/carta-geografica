const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const PHOTOS_ENABLED = Boolean(SERVER_URL);

export function photoSrc(path) {
  return `${SERVER_URL}${path}`;
}

export async function uploadPhotos(locationId, visitId, files) {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("photos", file));

  const response = await fetch(
    `${SERVER_URL}/api/photos/${locationId}/${visitId}`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Server responded ${response.status}`);
  }

  const { urls } = await response.json();
  return urls;
}
