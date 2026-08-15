import { useEffect, useState, useContext } from "react";
import { fetchToken } from "../api/login.js";
import { UserContext } from "../context/user.jsx";
import { searchUser } from "../api/searchUser.js";

export default function useLogin(signup) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = (event) => {
    event.preventDefault();
    const location = 'diddy';
    setError(null);
    // Empty strings
    if(username==""){
      setError("Nom d'utilisateur est obligatoire");
      return;
    }else if(password == ""){
      setError("Mot de passe est obligatoire");
      return;
    }

    setLoading(true);
    // username check
    if (signup){
      searchUser({username})
      .then((data) => {if(data._id){setError("Utilisateur existe déjà")}})
      .catch((err) => { setError(err.message)})
    }

    if (error != null){
      setLoading(false);
      return;
    }

    const req = signup? {username, password, location}: {username, password}
    fetchToken(req)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => setError("Nom d'utilisateur ou mot de passe incorrecte"))
      .finally(() => setLoading(false));
  };

  return { setUsername, setPassword, handleClick, loading, error, user };
}