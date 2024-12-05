import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from '../Firebase/Firebase';  // Import Firestore from Firebase config
import { collection, onSnapshot } from "firebase/firestore";  // Firestore methods

// Custom icon with FaCar React Icon rendered as HTML string
const customIcon = () => {
  return new L.divIcon({
    className: 'leaflet-div-icon',
    html: `<div style="font-size: 2px; color: #ff5733; text-align: center; vertical-align: middle; display: flex; justify-content: center; align-items: center;">&#xf1b9;</div>`,  // Font Awesome Car icon unicode for FaCar
    iconSize: [10, 10], // Size of the icon
    iconAnchor: [15, 30], // Anchor the icon in the correct position
    popupAnchor: [0, -30], // Offset the popup
  });
};

const MapView = () => {
  const [drivers, setDrivers] = useState([]);
  const [mapCenter, setMapCenter] = useState([21.1702, 72.8311]); // Default center

  // Fetch drivers from Firestore with real-time updates
  useEffect(() => {
    const driversCollectionRef = collection(db, "drivers");

    const unsubscribe = onSnapshot(driversCollectionRef, (snapshot) => {
      const driversData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driversData); // Update the state with the latest driver data
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Update map center dynamically after drivers data is fetched
  useEffect(() => {
    if (drivers.length > 0) {
      const latitudes = drivers.map(driver => driver.latitude);
      const longitudes = drivers.map(driver => driver.longitude);

      const avgLat = latitudes.reduce((acc, lat) => acc + lat, 0) / latitudes.length;
      const avgLon = longitudes.reduce((acc, lon) => acc + lon, 0) / longitudes.length;

      setMapCenter([avgLat, avgLon]); // Update center after drivers data is set
    }
  }, [drivers]);

  return (
    <div className="p-0" style={{ height: "100vh", width: "100vw" }}>
      <MapContainer center={mapCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {drivers.map((driver) => (
          // Check if latitude and longitude are defined before rendering the marker
          driver.latitude && driver.longitude ? (
            <Marker key={driver.id} position={[driver.latitude, driver.longitude]} icon={customIcon()}>
              <Popup>
                <strong>{driver.name}</strong>
                <p>{driver.mobileNo}</p>
                <span>{driver.carNo}</span>
                <p>{driver.vehicleType}</p>
              </Popup>
            </Marker>
          ) : null // If latitude or longitude is undefined, don't render the marker
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
