import { useEffect, useState } from "react";
import { fetchLocation } from "../api/location.js";

const locationCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = Infinity;

export function useLocation(id) {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const key = String(id);

    async function loadLocation() {
      try {
        setLoading(true);

        const cached = locationCache.get(key);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          if (isMounted) {
            setLocation(cached.data);
            setError(null);
            setLoading(false);
          }
          return;
        }

        if (inFlightRequests.has(key)) {
          const data = await inFlightRequests.get(key);
          if (isMounted) {
            setLocation(data);
            setError(null);
          }
          return;
        }

        const request = fetchLocation(id)
          .then((data) => {
            locationCache.set(key, {
              data,
              timestamp: Date.now()
            });
            return data;
          })
          .finally(() => {
            inFlightRequests.delete(key);
          });

        inFlightRequests.set(key, request);

        const data = await request;

        if (isMounted) {
          setLocation(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { location, loading, error };
}