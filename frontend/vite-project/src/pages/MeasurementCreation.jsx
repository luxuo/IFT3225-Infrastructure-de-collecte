import React, { useState, useEffect } from 'react';
import LoadError from '../components/loading/LoadError';
import Loading from '../components/loading/Loading';
import SelectList from '../components/SelectList';
import useMeasurementCreation from '../hooks/useMeasurementCreation';
import { useLocations } from '../hooks/useLocations';
import { Navigate } from 'react-router-dom';

export default function(){
    // const { user, locationId, loading, loadingMeasure, error, success, setSuccess, setSurroundingPeople, setAmbiance, setSourceDistance, setWeather, setSetting, setLocation, handleSubmit} = useMeasurementCreation();
    const { user, loading, error, success, formValues, formErrors, setSuccess, handleChange, handleSubmit} = useMeasurementCreation();
    const ambianceOptions = [{value:'calme', item:'calme'},{value:'social', item:'social'},{value:'neutre', item:'neutre'},{value:'bruyant', item:'bruyant'},{value:'chaotique', item:'chaotique'}]
    const weatherOptions = [{value:'clair', item:'clair'},{value:'nuageux', item:'nuageux'},{value:'brume', item:'brume'},{value:'precipitante', item:'precipitante'}]
    const settingOptions = [{value:'transport', item:'transport'},{value:'restauration', item:'restauration'},{value:'commerce', item:'commerce'},{value:'regroupement', item:'regroupement'},{value:'industriel', item:'industriel'},{value:'communautaire', item:'communautaire'},{value:'institutionnel', item:'institutionnel'},{value:'personnel', item:'personnel'}]
    const locationStatus = useLocations();
    const locationOptions = locationStatus.locations.map((location) => { return {item:location.name, value:location.id}});

    if(!user){
        return (
            <Navigate to="/login" />
        );
    }

    if(success){
        //setSuccess(false);
        return (
            <Navigate to={"/measurements/"+formValues.locationId} />
        )
    }

    if (locationStatus.loading){
        return (
            <Loading loadMessage={"Chargement des données..."} />
        );
    }

    if (loading){
        return (
             <Loading loadMessage={"Enregistrement de la mesure..."} />
        );
    }


    return (
        <div>
            {locationStatus.error? <LoadError errorMessage={locationStatus.error} />: <></>}
            <form onSubmit={handleSubmit}>
                <input name="surrounding_people" type="text" className="form-control" placeholder="Nombre de personnes autour" onChange={handleChange}></input>
                {formErrors.surrounding_people?<div className="alert alert-danger">{formErrors.surrounding_people}</div>:<></>}

                <SelectList name={'Ambiance'} jsonName={'ambiance'} options={ambianceOptions} handleChange={handleChange}></SelectList>
                {formErrors.ambiance?<div className="alert alert-danger">{formErrors.ambiance}</div>:<></>}

                <input name="source_distance" type="text" className="form-control" placeholder="Distance de la source du bruit" onChange={handleChange}></input>
                {formErrors.source_distance?<div className="alert alert-danger">{formErrors.source_distance}</div>:<></>}

                <SelectList name={'Météo'} jsonName={'weather'} options={weatherOptions} handleChange={handleChange}></SelectList>
                {formErrors.weather?<div className="alert alert-danger">{formErrors.weather}</div>:<></>}

                <SelectList name={'Environnement'} jsonName={'setting'} options={settingOptions} handleChange={handleChange}></SelectList>
                {formErrors.setting?<div className="alert alert-danger">{formErrors.setting}</div>:<></>}

                <SelectList name={'Lieu'} jsonName={'locationId'} options={locationOptions} handleChange={handleChange}></SelectList>
                {formErrors.locationId?<div className="alert alert-danger">{formErrors.locationId}</div>:<></>}

                <button type="submit" className="btn btn-primary" disabled={locationStatus.error}>Enregistrer mesure</button>
            </form>
            {error? <LoadError errorMessage={error} />: <></>}
        </div>
        
    );
}