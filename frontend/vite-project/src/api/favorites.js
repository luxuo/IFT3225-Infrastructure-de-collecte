export async function fetchCurrentUser(token) {
    const result = await fetch("http://localhost:8383/devices/me", {
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
    const result = await fetch(`http://localhost:8383/devices/favorites/${locationId}`, {
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