import { useEffect, useState, useContext } from "react";
import { fetchToken } from "../api/login.js";
import { UserContext } from "../context/user.jsx";

export default function useLogout() {
  const {user, setUser} = useContext(UserContext);
  setUser(undefined);
}