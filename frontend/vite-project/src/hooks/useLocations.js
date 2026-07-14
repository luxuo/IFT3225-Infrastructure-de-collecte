// src/hooks/useLignes.js
import { useEffect, useState } from "react";
import { fetchLocations } from "../api/locations.js";

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetchLocations()
      .then((data) => {
        setLocations(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading, error };
}