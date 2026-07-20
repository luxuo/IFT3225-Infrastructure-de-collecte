import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useLocations } from "../hooks/useLocations";
import { fetchLocation } from "../api/location";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export default function Map() {
  const { locations, loading, error } = useLocations();

  return (
    <main>
      <h1>Carte des lieux</h1>

      <p>
        Cliquez sur un icon pour consulter le portrait d’ambiance du lieu.
      </p>
      
      <MapContainer
        center={[45.5045, -73.613]}
        zoom={13}
        style={{ height: "650px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        
        {locations.map((place) => (
          <LocationMarker key={place._id} place={place} />
        ))}
       
      </MapContainer>
    </main>
    
  );
}


function LocationMarker({ place }) {
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadAmbiance() {
    if (measurements || loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchLocation(place.id);
      setMeasurements(result.measurements);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const latestMeasurement =
    measurements && measurements.length > 0
      ? [...measurements].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )[0]
      : null;

  return (
    <Marker
      position={[Number(place.lat), Number(place.lon)]}
      eventHandlers={{
        click: loadAmbiance
      }}
    >
      <Popup>
        <strong>{place.name}</strong>

        {loading && <p>Chargement de l’ambiance...</p>}

        {error && (
          <p>
            Probleme de données. Veuillez réessayer plus tard
          </p>
        )}

        {!loading && !error && latestMeasurement && (
          <>
            <p>Ambiance : {latestMeasurement.ambiance}</p>

            <p>
              Personnes autour : {latestMeasurement.surrounding_people}
            </p>

            <p>
              Dernière mesure :{" "}
              {new Date(latestMeasurement.timestamp).toLocaleString()}
            </p>

            <Link
              to={`/measurements/${place.id}`}
              style={{ display: "inline-block", padding: "8px 12px", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px" }}
            >
              Portrait d’ambiance complet
            </Link>
          </>
        )}

        {!loading && !error && measurements?.length === 0 && (
          <p>Aucune mesure disponible pour ce lieu</p>
        )}
      </Popup>
    </Marker>
  );
}
  
