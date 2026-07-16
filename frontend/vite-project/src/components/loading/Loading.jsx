import React from "react";

export default function({loadMessage}){
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2 text-muted">{loadMessage}</p>
      </div>
    );
}