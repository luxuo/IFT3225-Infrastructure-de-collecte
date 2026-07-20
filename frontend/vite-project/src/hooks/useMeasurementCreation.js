import { useEffect, useState, useContext } from "react";
import { fetchToken } from "../api/login.js";
import { UserContext } from "../context/user.jsx";
import recordNewData from "../services/phyphox.js";
import createMeasurement from "../api/createMeasurement.js"

export default function useMeasurementCreation() {
    // essential attributes
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [loadingMeasure, setLoadingMeasure] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // input attributes
  const [surrounding_people, setSurroundingPeople] = useState(null);
  const [ambiance, setAmbiance] = useState(null);
  const [source_distance, setSourceDistance] = useState(null);
  const [weather, setWeather] = useState(null);
  const [setting, setSetting] = useState(null);
  const [locationId, setLocation] = useState(null);
  const [ip, setIp] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const measurementData = {surrounding_people,ambiance,source_distance,weather,setting,locationId,ip};
    setLoading(true);
    createMeasurement(measurementData, user.authToken).then((data) => setSuccess(true)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  

  return { user, loading, loadingMeasure, error, success, setSuccess, setSurroundingPeople, setAmbiance, setSourceDistance, setWeather, setSetting, setLocation, setIp, handleSubmit};
}