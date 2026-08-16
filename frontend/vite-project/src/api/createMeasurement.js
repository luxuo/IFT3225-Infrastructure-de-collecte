import { API_URL } from "./url.js";
export default async function createMeasurement(data, authToken) {
    const res = await fetch(`${API_URL}/measurements`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${authToken}`
        }
    });
    if (!res.ok) {
    throw new Error(`Erreur lors de la création de mesure (HTTP ${res.status}).`);
    }
    return res.json();
}