import { useEffect, useState } from "react";
import { fetchToken } from "../api/login.js";

export default function useLogin(req) {
  const [login, setLogin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetchToken(req)
      .then((data) => {
        setLogin(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { login, loading, error };
}