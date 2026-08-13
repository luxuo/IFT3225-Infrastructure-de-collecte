const CACHE_TTL_MS = 60_000;

let cachedLocations = null;
let cachedAt = 0;
let inFlightPromise = null;

export async function fetchLocations(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && cachedLocations && now - cachedAt < CACHE_TTL_MS) {
    return cachedLocations;
  }

  if (!forceRefresh && inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = fetch("http://localhost:8383/locations")
    .then((result) => {
      if (!result.ok) {
        throw new Error(`Impossible de charger les lignes (HTTP ${result.status}).`);
      }

      return result.json();
    })
    .then((data) => {
      cachedLocations = data;
      cachedAt = Date.now();
      return data;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}

export function invalidateLocationsCache() {
  cachedLocations = null;
  cachedAt = 0;
}