import { useEffect, useState } from "react";
import { fetchToken } from "../api/login.js";

export function useLogin(place) {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetchLocation(place)
      .then((data) => {
        setLocation(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { location, loading, error };
}