export async function fetchLocationInfo(location) {
  const result = await fetch(`http://localhost:8383/locations/${location}`);

  if (!result.ok) {
    throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
  }

  return result.json();
}