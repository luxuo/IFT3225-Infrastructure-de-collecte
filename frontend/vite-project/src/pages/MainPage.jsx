
import React, { useState, useEffect } from 'react';
import ListeLieux from '../components/ListeLieux.jsx';
import Header from '../components/Header.jsx';
import { useLocations } from '../hooks/useLocations.js';


function MainPage() {
  const { locations, loading, error } = useLocations();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2 text-muted">Chargement des lieux d'ambiance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          <strong>Erreur :</strong> Connection à l'API échoué ({error}). 
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Header/>
      <ListeLieux locations={locations}></ListeLieux>
    </div>
  );
}

export default MainPage;