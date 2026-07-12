
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

  useEffect(() => {
    // Remplacer avec fetch
    setTimeout(() => {
      setLocations(exampleLocations);
      setLoading(false);
    }, 500);
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

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="fw-bold">Ambiances de lieux</h1>
        <p className="text-muted">Projet - IFT3225</p>
      </header>

      <div className="row g-4">
        {locations.map((lieu) => (
          <div key={lieu.id} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column align-items-start">
                <h2 className="card-title h5 mb-3">{lieu.name}</h2>
                
                <span className={`badge ${getBadgeClass(lieu.class)} text-uppercase mb-3`}>
                  {lieu.class}
                </span>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;