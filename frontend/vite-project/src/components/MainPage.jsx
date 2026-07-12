
import React, { useState, useEffect } from 'react';

// exemple de locations pour tester
const exampleLocations = [
  { id: 1, name: "Bibliothèque", class: "calme" },
  { id: 2, name: "Café", class: "animé" },
  { id: 3, name: "Gym", class: "modéré" },
  { id: 4, name: "Bar", class: "animé" }
];

function MainPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8383/devices')
      .then((response) => {
        if(!response.ok){
          throw new Error("Erreur pendant la récupération des données")
        }
      return response.json();
      })
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });

  }, []);

  // Assigner couleur au badge
  const getBadgeClass = (classification) => {
    switch (classification) {
      case 'calme': return 'bg-success';     // Vert
      case 'modéré': return 'bg-warning text-dark'; // Jaune
      case 'animé': return 'bg-danger';       // Rouge
      default: return 'bg-secondary';
    }
  };

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
      <header className="text-center mb-5">
        <h1 className="fw-bold">Ambiances de lieux</h1>
        <p className="text-muted">Projet - IFT3225</p>
      </header>

      <div className="row g-4">
        {locations.map((lieu) => (
          <div key={lieu._id} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column align-items-start">
                <h2 className="card-title h5 mb-3">{lieu.location}</h2>
                
                {/*
                <span className={`badge ${getBadgeClass(lieu.class)} text-uppercase mb-3`}>
                  {lieu.class}
                </span>
                */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;