import { API_URL } from "./url.js";
export async function fetchLocationInfo(location) {
  const result = await fetch(`${API_URL}/locations/${location}`);

  if (!result.ok) {
    throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
  }

  return result.json();
}