import { API_URL } from "./url.js";
export async function fetchCurrentUser(token) {
    const result = await fetch(`${API_URL}/devices/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!result.ok) {
        throw new Error(`Impossible de charger l'utilisateur (HTTP ${result.status}).`);
    }

    return result.json();
}

export async function toggleFavorite(locationId, token) {
    const result = await fetch(`${API_URL}/devices/favorites/${locationId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!result.ok) {
        throw new Error(`Impossible de modifier le favori (HTTP ${result.status}).`);
    }

    return result.json();
}