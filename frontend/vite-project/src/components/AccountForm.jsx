import React from "react";

export default function ({statement, handleClick, setUsername, setPassword}) {
    return (
        <form>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                <input type="text" onChange={(e) => {setUsername(e.target.value)}} className="form-control" id="username"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <input type="password" onChange={(e) => {setPassword(e.target.value)}} className="form-control" id="password"/>
            </div>
            <button type="submit" onClick={handleClick} className="btn btn-primary">{statement}</button>
        </form>
    )
}