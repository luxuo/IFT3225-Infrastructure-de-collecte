import { useEffect, useState } from "react";
import { fetchLocation } from "../api/location.js";

export function useLocation(id) {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetchLocation(id)
      .then((data) => {
        setLocation(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { location, loading, error };
}