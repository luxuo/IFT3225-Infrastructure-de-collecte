import { API_URL } from "./url.js";
export async function searchUser(req) {
  const result = await fetch(`${API_URL}/devices/search`, {
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