import React from "react";

export default function({errorMessage}){
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          <strong>Erreur :</strong> {errorMessage} 
        </div>
      </div>
    );
}