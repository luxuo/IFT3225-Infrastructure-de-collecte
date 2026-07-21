

export async function fetchMeasurements(token) {
  const result = await fetch(`http://localhost:8383/user/measurements/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!result.ok) {
    throw new Error(`Impossible de trouver les mesures de l'utilisateur (HTTP ${result.status}).`);
  }

  return result.json();
}