import React from 'react';
import { Link } from "react-router";



export default function () {
    return (
        <div>
            <Link to="/login"><button className="btn btn-outline-primary me-2" type="button">Se Connecter</button></Link>
            <Link to="/signup"><button className="btn btn-outline-dark me-2" type="button">Créer un Compte</button></Link>
        </div>
    );
}