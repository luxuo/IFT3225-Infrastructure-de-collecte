export async function fetchLocation(location) {
  const result = await fetch(`http://localhost:8383/measurements/${location}`);

  if (!result.ok) {
    throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
  }

  return result.json();
}