import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.jsx";
import { fetchCurrentUser } from "../api/favorites.js";
import { fetchLocations } from "../api/locations.js";
import { Link } from "react-router-dom";

export default function UserPage() {
    const { user } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                if (!user?.authToken) {
                    setError("Utilisateur non connecté.");
                    return;
                }

                const me = await fetchCurrentUser(user.authToken);
                const locations = await fetchLocations();

                const favoriteLocations = locations.filter((location) =>
                    (me.favorites ?? []).includes(location.id)
                );

                setFavorites(favoriteLocations);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user]);

    if (loading) {
        return <div className="container my-5">Chargement...</div>;
    }

    if (error) {
        return <div className="container my-5 text-danger">{error}</div>;
    }

    return (
        <div className="container my-5">
            <h1>Mes lieux favoris</h1>

            {favorites.length === 0 ? (
                <p>Aucun lieu favori ajouté</p>
            ) : (
                <div className="list-group">
                    {favorites.map((location) => (
                        <Link
                            key={location.id}
                            to={`/measurements/${location.id}`}
                            className="list-group-item list-group-item-action"
                        >
                            {location.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}