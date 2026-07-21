import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.jsx";
import { fetchCurrentUser } from "../api/favorites.js";
import { fetchLocations } from "../api/locations.js";
import { fetchMeasurements } from "../api/measurements.js";
import {fetchLocationInfo} from "../api/locationInfo.js";
import { Link } from "react-router-dom";

export default function UserPage() {
    const { user } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [locationNames, setLocationNames] = useState({});
    const [myMeasurements, setMyMeasurements] = useState([]);
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
                const measurementsData = await fetchMeasurements(user.authToken);

                const favoriteLocations = locations.filter((location) =>
                    (me.favorites ?? []).includes(location.id)
                );

                // To get the location names
                const measurements = measurementsData.measurements ?? [];
                const uniqueLocationIds = [...new Set(
                    measurements.map((measurement) => measurement.locationId)
                )];
                const namesEntries = await Promise.all(
                    uniqueLocationIds.map(async (id) => {
                        const locationInfo = await fetchLocationInfo(id);
                        return [id, locationInfo[0]?.name ?? `Lieu ${id}`];
                    })
                );
                const namesMap = Object.fromEntries(namesEntries);

                setFavorites(favoriteLocations);
                setLocationNames(namesMap);
                setMyMeasurements(measurementsData.measurements ?? []);
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

            <h2 className="mt-5">Mes mesures</h2>

            {myMeasurements.length === 0 ? (
                <p>Aucune mesure créée par cet utilisateur.</p>
            ) : (
                <div className="list-group">
                    {myMeasurements.map((measurement) => (
                        <Link
                            key={measurement._id}
                            to={`/measurements/${measurement.locationId}`}
                            className="list-group-item list-group-item-action"
                        >
                            {locationNames[measurement.locationId] ?? `Lieu ${measurement.locationId}`} - {measurement.ambiance}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}