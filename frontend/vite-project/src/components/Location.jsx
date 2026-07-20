import React from 'react';

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserContext } from "../context/user.jsx";
import { fetchCurrentUser, toggleFavorite } from "../api/favorites.js";
import { fetchLocation } from "../api/location.js";
import {fetchLocationInfo} from "../api/locationInfo.js";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function ambianceToValue(ambiance) {
    const value = (ambiance || '').toLowerCase();

    if (value === 'calme') return 0;
    if (value === 'social' || value === 'neutre') return 1;
    if (value === 'bruyant' || value === 'chaotique') return 2;

    return 1;
}

function ambianceToLabel(value) {
    if (value === 0) return 'calme';
    if (value === 1) return 'modéré';
    if (value === 2) return 'animé';

    return value;
}

export default function({ location_measurements }) {
    
    // Partie de la gestion des favoris
    const { locationId } = useParams();
    const { user } = useContext(UserContext);
    const [location, setLocation] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [locationName, setLocationName] = useState("");

    useEffect(() => {
        async function loadData() {
            const data = await fetchLocation(locationId);
            setLocation(data);

            const locationData = await fetchLocationInfo(locationId);
            setLocationName(locationData[0].name);

            if (user?.authToken) {
                const me = await fetchCurrentUser(user.authToken);
                setIsFavorite(me.favorites.includes(Number(locationId)));
            }
        }

        loadData();
    }, [locationId, user]);

    const handleFavoriteClick = async () => {
        if (!user?.authToken) return;

        const result = await toggleFavorite(locationId, user.authToken);
        setIsFavorite(result.isFavorite);
        setUser({
        ...user,
        device: {
            ...user.device,
            favorites: result.favorites
        }
    });
    };

    

    if (!location) {
        return <div className="container my-5">Chargement...</div>;
    }



    // partie du graph historique
    const measurements = location_measurements?.measurements ?? [];
    const chartData = measurements
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((measurement, index) => ({
            x: new Date(measurement.timestamp).toLocaleString(),
            y: ambianceToValue(measurement.ambiance),
        }));


    return (
        

        <div className="container my-5">
            <div className="d-flex align-items-center gap-2">
                <h1 className="mb-0">{locationName}</h1>
                <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className="btn btn-link p-0"
                    style={{
                        fontSize: "2rem",
                        color: isFavorite ? "#f4c430" : "#999"
                    }}
                    title="Ajouter aux favoris"
                >
                    {isFavorite ? "★" : "☆"}
                </button>
            </div>

            {chartData.length === 0 ? (
            <div className="text-center mt-5">
                <p>Aucune mesure disponible pour tracer le graphe.</p>
            </div>
        ) : (
            <div className='text-center mt-5' style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis
                        domain={[0, 2]}
                        ticks={[0, 1, 2]}
                        tickFormatter={ambianceToLabel}
                    />
                    <Tooltip
                        formatter={(value) => ambianceToLabel(value)}
                        labelFormatter={(label) => `Mesure ${label}`}
                    />
                    <Line type="monotone" dataKey="y" stroke="#0d6efd" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        )}
        </div>
    );
}