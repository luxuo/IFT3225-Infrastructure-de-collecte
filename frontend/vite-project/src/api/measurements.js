import { API_URL } from "./url.js";

export async function fetchMeasurements(token) {
  const result = await fetch(`${API_URL}/user/measurements/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!result.ok) {
    throw new Error(`Impossible de trouver les mesures de l'utilisateur (HTTP ${result.status}).`);
  }

  return result.json();
}