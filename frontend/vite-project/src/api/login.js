import { API_URL } from "./url.js";
export async function fetchToken(req) {
  const endpoint = req.location?'/devices':'/devices/token'
  const result = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

  if (!result.ok) {
    throw new Error(`Erreur lors ${req.location?' de la création de compte':'de la connexion'} (HTTP ${result.status}).`);
  }

  return result.json();
}