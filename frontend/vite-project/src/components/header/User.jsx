import React from 'react';
import { Link } from "react-router";


export default function ({user}) {
    return (
        <div>
            <Link to="/users"><button className="btn btn-outline-primary me-2" type="button">{user}</button></Link>
            <Link to="/logout"><button className="btn btn-outline-error me-2" type="button">Se déconnecter</button></Link>
        </div>
    );
}