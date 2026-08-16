import { useEffect, useState, useContext } from "react";
import { fetchToken } from "../api/login.js";
import { UserContext } from "../context/user.jsx";
import recordNewData from "../services/phyphox.js";
import createMeasurement from "../api/createMeasurement.js"

export default function useMeasurementCreation() {
  // essential attributes
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); 
  // input attributes
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});


  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name == value){
      setFormValues({...formValues, [name]:null});
    }else{
      const errors = formErrors;
      delete errors[name];
      setFormErrors(errors);

      setFormValues({...formValues, [name]:value});
    }
  }

  const validate = (values) => {
    const errors = {};
    if (!Number.isInteger(Number(values.surrounding_people))) {errors.surrounding_people = "Doit être un chiffre"}
    else if (Number(values.surrounding_people) <= 0) {errors.surrounding_people = "Le chiffre doit être supérieur à 0"}

    if (!values.ambiance) {errors.ambiance = "Doit spécifier une ambiance"}

    if (!Number.isFinite(Number(values.source_distance))){ errors.source_distance = "Doit être un nombre positif"}
    else if (Number(values.surrounding_people) < 0) {errors.source_distance = "Doit être supérieur à 0m"}

    if (!values.weather) {errors.weather = "Doit spécifier la météo"}

    if (!values.setting) {errors.setting = "Doit spécifier le type de lieu"}

    if (!values.locationId) {errors.locationId = "Doit sépcifier le lieu"}

    return errors
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validate(formValues)
    setFormErrors(errors)
    if (Object.keys(errors).length != 0) {console.log(errors);return;}


    setLoading(true);
    createMeasurement(formValues, user.authToken).then((data) => setSuccess(true)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  
  return { user, loading, error, success, formValues, formErrors, setSuccess, handleChange, handleSubmit};
}