import React, { useState, useEffect } from 'react';
import LoadError from '../components/loading/LoadError';
import Loading from '../components/loading/Loading';
import SelectList from '../components/SelectList';
import useMeasurementCreation from '../hooks/useMeasurementCreation';
import { useLocations } from '../hooks/useLocations';
import { Navigate } from 'react-router-dom';

export default function(){
    const { user, locationId, loading, loadingMeasure, error, success, setSuccess, setSurroundingPeople, setAmbiance, setSourceDistance, setWeather, setSetting, setLocation, setIp, handleSubmit} = useMeasurementCreation();
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
            <Navigate to={"/measurements/"+locationId} />
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

    if (loadingMeasure){
        return (
            <Loading loadMessage={"Attente de la mesure... Ceci devrait prendre 10 secondes"} />
        );
    }


    return (
        <div>
            {locationStatus.error? <LoadError errorMessage={locationStatus.error} />: <></>}
            <form onSubmit={handleSubmit}>
                <input type="text" className="form-control" placeholder="Nombre de personnes autour" onChange={(e) => {setSurroundingPeople(e.target.value)}}></input>
                <SelectList name={'Ambiance'} options={ambianceOptions} setOption={setAmbiance}></SelectList>
                <input type="text" className="form-control" placeholder="Distance de la source du bruit" onChange={(e) => {setSourceDistance(e.target.value)}}></input>
                <SelectList name={'Météo'} options={weatherOptions} setOption={setWeather}></SelectList>
                <SelectList name={'Environnement'} options={settingOptions} setOption={setSetting}></SelectList>
                <SelectList name={'Lieu'} options={locationOptions} setOption={setLocation}></SelectList>
                <input type="text" className="form-control" placeholder="Address IP du téléphone" onChange={(e) => {setIp(e.target.value)}}></input>
                <button type="submit" className="btn btn-primary" disabled={locationStatus.error}>Prendre mesure</button>
            </form>
            {error? <LoadError errorMessage={error} />: <></>}
        </div>
        
    );
}