import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import places from "../data/Locations";
// import useApi from "../../../../src/interface/hooks/useApi.js";

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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place, index) => (
          <Marker 
            key={index}
            position={[place.lat, place.lng]}
          >
            <Popup>
              <p>Ambiance: {place.ambiance}</p>
              <p>Niveau de bruit moyen: {place.noiseLevel}</p>
              <p>Niveau sonore en db: {place.noisedb}</p>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </main>
  );
}
