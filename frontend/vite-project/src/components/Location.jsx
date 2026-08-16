import React from 'react';

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserContext } from "../context/user.jsx";
import { fetchCurrentUser, toggleFavorite } from "../api/favorites.js";
import { fetchLocation } from "../api/location.js";
import {fetchLocationInfo} from "../api/locationInfo.js";
import { fetchComments, createComment } from "../api/comments.js";

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
    const { user, setUser } = useContext(UserContext);
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

    


    // partie badge
    const infoMeasurements = location_measurements?.measurements ?? [];
    
    const latestMeasurement =
    infoMeasurements && infoMeasurements.length > 0
      ? [...infoMeasurements].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )[0]
      : null;

    // partie des creneaux calmes
    const calmSlots = infoMeasurements.filter(
        (measurement) => measurement.ambiance.toLowerCase() === "calme"
    );
    // partie du graph historique
    const measurements = location_measurements?.measurements ?? [];
    const chartData = measurements
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((measurement, index) => ({
            x: new Date(measurement.timestamp).toLocaleString(),
            y: ambianceToValue(measurement.ambiance),
        }));

    
    // partie des commentaires
    const [comments, setComments] = useState([]);
    const [commentsError, setCommentsError] = useState("");
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
    async function loadComments() {
        try {
        setCommentsError("");
        const data = await fetchComments(locationId);
        setComments(data.comments ?? []);
        } catch (err) {
        setCommentsError(err.message);
        }
    }
    loadComments();
    }, [locationId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!user?.authToken) return;

        const trimmed = commentText.trim();
        if (!trimmed) {
            setCommentError("Le commentaire ne peut pas être vide.");
            return;
        }

        setCommentLoading(true);
        setCommentError("");

        try {
            const data = await createComment(locationId, trimmed, user.authToken);
            setComments((current) => [data.comment, ...current]);
            setCommentText("");
        } catch (err) {
            setCommentError(err.message);
        } finally {
            setCommentLoading(false);
        }
        };

    if (!location) {
        return <div className="container my-5">Chargement...</div>;
    }

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

            <span className="badge">
                <p style={{ color: "black", fontSize: "30px" }}>Ambiance: {latestMeasurement?.ambiance}</p>
            </span>

            <div className="portrait">
                <p> Personnes autour : {latestMeasurement?.surrounding_people}</p>
                <p> Dernière mesure :{" "} {new Date(latestMeasurement?.timestamp).toLocaleString()}</p>
            </div>

            <div className="creneaux calmes">
                {calmSlots.length === 0 ? (
                <p>Aucun créneau calme disponible.</p>
                ) : (
                <ul>
                <p>Créneaux calmes :</p>
                {calmSlots.map((measurement) => (
                <li key={measurement._id}>
                {new Date(measurement.timestamp).toLocaleString()}
                </li>
                ))}
                </ul>
                )}
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
        
        <div className="mt-5">
  <h2 className="h4 mb-3">Commentaires sur l'ambiance</h2>

  {commentsError ? (
    <div className="alert alert-warning">{commentsError}</div>
  ) : null}

  {comments.length === 0 ? (
    <p>Aucun commentaire pour le moment.</p>
  ) : (
    <div className="list-group">
      {comments.map((comment) => (
        <div key={comment._id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>{comment.author}</strong>
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </div>
          <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  )}

  {user?.authToken ? (
    <form onSubmit={handleCommentSubmit} className="mt-4">
      <div className="mb-3">
        <label htmlFor="commentContent" className="form-label">
          Ajouter un commentaire
        </label>
        <textarea
          id="commentContent"
          className="form-control"
          rows="3"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Décris l'ambiance du lieu..."
        />
      </div>

      {commentError ? (
        <div className="alert alert-danger">{commentError}</div>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={commentLoading}>
        {commentLoading ? "Publication..." : "Publier"}
      </button>
    </form>
  ) : (
    <p className="text-muted mt-4">
      Connecte-toi pour ajouter un commentaire.
    </p>
  )}
</div>
        </div>
    );
}
