export async function fetchLocations() {
  const result = await fetch('http://localhost:8383/devices');

  if (!result.ok) {
    throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
  }

  return result.json();
}