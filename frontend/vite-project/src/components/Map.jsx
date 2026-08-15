import { useEffect, useState } from "react";
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

  const [selectedAmbiance, setSelectedAmbiance] = useState("toutes");
  const [locationsWithAmbiance, setLocationsWithAmbiance] = useState([]);
  const [loadingAmbiances, setLoadingAmbiances] = useState(true);

  useEffect(() => {
    async function loadAmbiances() {
      if (!locations || locations.length === 0) {
        setLocationsWithAmbiance([]);
        setLoadingAmbiances(false);
        return;
      }

      setLoadingAmbiances(true);

      const enrichedLocations = await Promise.all(
        locations.map(async (place) => {
          try {
            const result = await fetchLocation(place.id);

            const measurements = result.measurements ?? [];

            const latestMeasurement =
              measurements.length > 0
                ? [...measurements].sort(
                    (a, b) =>
                      new Date(b.timestamp) - new Date(a.timestamp)
                  )[0]
                : null;

            return {
              ...place,
              latestMeasurement,
              ambiance: latestMeasurement?.ambiance ?? null
            };
          } catch (err) {
            console.error(
              `Erreur lors du chargement du lieu ${place.id}:`,
              err
            );

            return {
              ...place,
              latestMeasurement: null,
              ambiance: null
            };
          }
        })
      );

      setLocationsWithAmbiance(enrichedLocations);
      setLoadingAmbiances(false);
    }

    loadAmbiances();
  }, [locations]);

  const filteredLocations =
    selectedAmbiance === "toutes"
      ? locationsWithAmbiance
      : locationsWithAmbiance.filter(
          (place) =>
            place.ambiance?.toLowerCase() ===
            selectedAmbiance.toLowerCase()
        );

  if (loading) {
    return (
      <main>
        <p>Chargement des lieux...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>Erreur lors du chargement des lieux : {error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Carte des lieux</h1>

      <p>
        Cliquez sur une icône pour consulter le portrait d’ambiance du lieu.
      </p>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="filtreAmbiance">
          Quelle ambiance voulez-vous ?{" "}
        </label>

        <select
          id="filtreAmbiance"
          value={selectedAmbiance}
          onChange={(e) => setSelectedAmbiance(e.target.value)}
        >
          <option value="toutes">Toutes</option>
          <option value="calme">Calme</option>
          <option value="social">Social</option>
          <option value="bruyant">Bruyant</option>
          <option value="excitant">Excitant</option>
        </select>
      </div>

      {loadingAmbiances && <p>Chargement des ambiances...</p>}

      {!loadingAmbiances &&
        selectedAmbiance !== "toutes" &&
        filteredLocations.length === 0 && (
          <p>Aucun lieu trouvé avec cette ambiance.</p>
        )}

      <MapContainer
        center={[45.5045, -73.613]}
        zoom={13}
        style={{ height: "650px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredLocations.map((place) => (
          <LocationMarker
            key={place._id ?? place.id}
            place={place}
          />
        ))}
      </MapContainer>
    </main>
  );
}

function LocationMarker({ place }) {
  const latestMeasurement = place.latestMeasurement;

  const lat = Number(place.lat);
  const lon = Number(place.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    console.warn(
      `Coordonnées invalides pour ${place.name}:`,
      place.lat,
      place.lon
    );

    return null;
  }

  return (
    <Marker position={[lat, lon]}>
      <Popup>
        <strong>{place.name}</strong>

        {latestMeasurement ? (
          <>
            <p>
              Ambiance : {latestMeasurement.ambiance}
            </p>

            <p>
              Personnes autour :{" "}
              {latestMeasurement.surrounding_people}
            </p>

            <p>
              Dernière mesure :{" "}
              {new Date(
                latestMeasurement.timestamp
              ).toLocaleString()}
            </p>

            <Link
              to={`/measurements/${place.id}`}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px"
              }}
            >
              Portrait d’ambiance complet
            </Link>
          </>
        ) : (
          <p>Aucune mesure disponible pour ce lieu.</p>
        )}
      </Popup>
    </Marker>
  );
}