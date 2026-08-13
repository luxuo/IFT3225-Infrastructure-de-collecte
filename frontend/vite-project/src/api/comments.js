import {API_URL} from "./url.js";

export async function fetchComments(locationId) {
  const result = await fetch(`${API_URL}/comments/${locationId}`);

  if (!result.ok) {
    throw new Error(`Impossible de charger les commentaires (HTTP ${result.status}).`);
  }

  return result.json();
}

export async function createComment(locationId, content, token) {
  const result = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      locationId: Number(locationId),
      content
    })
  });

  if (!result.ok) {
    throw new Error(`Impossible d'ajouter le commentaire (HTTP ${result.status}).`);
  }

  return result.json();
}