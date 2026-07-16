import React from "react";

export default function ({statement}) {
    return (
        <form>
            <div class="mb-3">
                <label for="username" class="form-label">Nom d'utilisateur</label>
                <input type="text" class="form-control" id="username" />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" id="password" />
            </div>
            <button type="submit" class="btn btn-primary">{statement}</button>
        </form>
    )
}