import React, {useContext} from 'react';
import { Link } from "react-router";
import { UserContext } from '../context/user';
import User from './header/User';
import Guest from './header/Guest';


export default function () {
    const {user, setUser} = useContext(UserContext);
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link to="/"><div className="--bs-primary-text-emphasis navbar-brand" href="#">Infrastructure de Collecte</div></Link>
                {user === undefined? <Guest/>: <><Link to="/measurements" className="btn btn-outline-primary me-2">Soummettre une mesure</Link><User user={user}/></>}
            </div>
        </nav>
    );
}