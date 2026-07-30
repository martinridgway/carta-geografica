export async function geocodeAddress(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1&addressdetails=1`
  );
  const results = await response.json();

  if (!results.length) {
    throw new Error(`No results found for "${query}"`);
  }

  const [result] = results;

  return {
    address: result.address,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon)
  };
}
