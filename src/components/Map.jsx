import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CititesContext";
import Button from "./Button";
import { useGeolocation } from "../hooks/Getgeolocation";
import useLatLng from "../hooks/GetLatLng";

function Map() {
  const { cities } = useCities();
  const [mapLat, mapLng] = useLatLng();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const { position: geoPosition, getPosition } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(() => {
    if (geoPosition) setMapPosition(geoPosition);
  }, [geoPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button type={"position"} onClick={getPosition}>
        Get Location
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
        <UpdateMap position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function UpdateMap({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
