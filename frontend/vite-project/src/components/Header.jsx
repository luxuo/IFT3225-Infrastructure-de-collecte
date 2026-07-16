import React from 'react';
import { Link } from "react-router";



export default function () {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link to="/"><div className="--bs-primary-text-emphasis navbar-brand" href="#">Infrastructure de Collecte</div></Link>
                <div>
                    <Link to="/login"><button className="btn btn-outline-primary me-2" type="button">Se Connecter</button></Link>
                    <Link to="/signup"><button className="btn btn-outline-dark me-2" type="button">Créer un Compte</button></Link>
                </div>
            </div>
        </nav>
    );
}