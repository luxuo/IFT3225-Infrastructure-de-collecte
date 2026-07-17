import { useEffect, useState, useContext } from "react";
import { fetchToken } from "../api/login.js";
import { UserContext } from "../context/user.jsx";

export default function useLogin(signup) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = (event) => {
    event.preventDefault();
    setLoading(true);
    const location = 'diddy'
    const req = signup? {username, password, location}: {username, password}
    fetchToken(req)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { setUsername, setPassword, handleClick, loading, error, user };
}