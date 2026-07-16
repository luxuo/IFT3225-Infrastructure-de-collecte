export async function fetchToken(req) {
  const result = await fetch("http://localhost:8383/devices/token", {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

  if (!result.ok) {
    throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
  }

  return result.json();
}