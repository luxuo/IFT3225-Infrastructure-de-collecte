import { API_URL } from "./url.js";
export async function fetchLocation(location) {
  const result = await fetch(`${API_URL}/measurements/${location}`);

  if (!result.ok) {
    throw new Error(`Impossible de trouver les données du lieu (HTTP ${result.status}).`);
  }

  return result.json();
}