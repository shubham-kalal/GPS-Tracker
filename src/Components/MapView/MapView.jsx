import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "../Firebase/Firebase";
import { collection, onSnapshot } from "firebase/firestore";

const customIcon = new L.divIcon({
  className: "leaflet-div-icon",
  html: `<div style="font-size: 1.5em; ">🚗</div>`,
  iconSize: [30, 30],
});

const MapView = () => {
  const [drivers, setDrivers] = useState([]);
  const [mapCenter, setMapCenter] = useState([21.1702, 72.8311]);

  useEffect(() => {
    const driversCollectionRef = collection(db, "drivers");
    const unsubscribe = onSnapshot(driversCollectionRef, (snapshot) => {
      const driversData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driversData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (drivers.length > 0) {
      const avgLat = drivers.reduce((sum, d) => sum + d.latitude, 0) / drivers.length;
      const avgLon = drivers.reduce((sum, d) => sum + d.longitude, 0) / drivers.length;
      setMapCenter([avgLat, avgLon]);
    }
  }, [drivers]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {drivers.map(
          (driver) =>
            driver.latitude &&
            driver.longitude && (
              <Marker
                key={driver.id}
                position={[driver.latitude, driver.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <strong>{driver.name}</strong>
                  <p>Mobile: {driver.mobileNo}</p>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
