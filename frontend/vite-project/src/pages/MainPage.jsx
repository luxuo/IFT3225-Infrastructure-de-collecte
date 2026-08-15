
import React, { useState, useEffect } from 'react';
import LocationList from '../components/LocationList.jsx';
import { useLocations } from '../hooks/useLocations.js';
import Loading from '../components/loading/Loading.jsx';
import LoadError from '../components/loading/LoadError.jsx';
import Map from '../components/Map.jsx';

function MainPage() {
  const { locations, loading, error } = useLocations();

  if (loading) {
    return (
      <Loading loadMessage={"Chargement des lieux..."}></Loading>
    );
  }

  if (error) {
    return (
      <LoadError errorMessage={`Connection à l'API échoué (${error}).`}></LoadError>
    );
  }

  return (
    <div className="container my-5">
      <Map></Map>
      <LocationList locations={locations}></LocationList>
    </div>
  );
}

export default MainPage;