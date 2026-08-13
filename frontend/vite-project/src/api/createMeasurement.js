import { API_URL } from "./url.js";
export default async function createMeasurement(data, authToken) {
    const res = await fetch(`${API_URL}/phyphox/measurements`, {
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

// export default async function createMeasurement(data, authToken) {
    // const res = await fetch("http://localhost:" + process.env.PORT + "/measurements", {
        // method: "POST",
        // body: JSON.stringify(data),
        // headers: {
            // "Content-type": "application/json; charset=UTF-8",
            // "Authorization": `Bearer ${authToken}`
        // }
    // });
    // if (!res.ok) {
    // throw new Error(`Erreur lors de la création de mesure (HTTP ${result.status}).`);
    // }
    // return res.json();
// }