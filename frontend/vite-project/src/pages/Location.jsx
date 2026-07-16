import React, { useState, useEffect } from 'react';
import Location from '../components/Location.jsx';
import { useLocation } from '../hooks/useLocation.js';
import { useParams } from "react-router";

export default function(){
    const {locationId} = useParams();
    const { location, loading, error } = useLocation(locationId);
    
      if (loading) {
        return (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2 text-muted">Chargement du lieu...</p>
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
        <Location location_measurements={location}></Location>
    )
}