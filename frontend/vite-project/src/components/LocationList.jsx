import React from 'react';
import { Link } from "react-router";

export default function({locations}){

    // Assigner couleur au badge
    const getBadgeClass = (classification) => {
    switch (classification) {
      case 'calme': return 'bg-success';     // Vert
      case 'modéré': return 'bg-warning text-dark'; // Jaune
      case 'animé': return 'bg-danger';       // Rouge
      default: return 'bg-secondary';
    }
  };

    return(
        <div className="row g-4">
          <br />
          <h1>Liste de lieux</h1>
        {locations.map((lieu) => (
          <div key={lieu._id} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm">
              <Link to={"/measurements/" + lieu.id}>
                <div className="card-body d-flex flex-column align-items-start">
                  <h2 className={"card-title h5 mb-3 "}>{lieu.name}</h2>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
}