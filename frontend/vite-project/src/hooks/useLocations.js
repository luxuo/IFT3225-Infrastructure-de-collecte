// src/hooks/useLignes.js
import { useEffect, useState } from "react";
import { fetchLocations } from "../api/locations.js";

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    fetchLocations()
      .then((data) => {
        if (!isMounted) return;
        setLocations(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { locations, loading, error };
}