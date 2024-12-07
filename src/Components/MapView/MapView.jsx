import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "../Firebase/Firebase"; // Import Firebase configuration
import { collection, onSnapshot } from "firebase/firestore"; // Firestore methods

// Custom icon for drivers
const customIcon = new L.divIcon({
  className: "leaflet-div-icon",
  html: `<div style="font-size: 1.5em; color: #ff5733; text-align: center; display: flex; justify-content: center; align-items: center;">&#xf1b9;</div>`, // Font Awesome Car icon
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -30],
});

// Helper Component to Move Marker Dynamically
const DynamicMarker = ({ position, icon, children }) => {
  const map = useMap();
  const markerRef = React.useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.setLatLng(position); // Update marker position
    }
  }, [position]);

  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      {children}
    </Marker>
  );
};

const MapView = () => {
  const [drivers, setDrivers] = useState([]);
  const [mapCenter, setMapCenter] = useState([21.1702, 72.8311]); // Default center

  // Fetch drivers from Firestore with real-time updates
  useEffect(() => {
    const driversCollectionRef = collection(db, "drivers");
    const unsubscribe = onSnapshot(
      driversCollectionRef,
      (snapshot) => {
        const driversData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrivers(driversData); // Update drivers state
      },
      (error) => {
        console.error("Error fetching drivers:", error);
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Update map center dynamically
  useEffect(() => {
    if (drivers.length > 0) {
      const avgLat = drivers.reduce((sum, driver) => sum + driver.latitude, 0) / drivers.length;
      const avgLon = drivers.reduce((sum, driver) => sum + driver.longitude, 0) / drivers.length;
      setMapCenter([avgLat, avgLon]);
    }
  }, [drivers]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {drivers.map((driver) => (
          driver.latitude && driver.longitude ? (
            <DynamicMarker
              key={driver.id}
              position={[driver.latitude, driver.longitude]}
              icon={customIcon}
            >
              <Popup>
                <strong>{driver.name}</strong>
                <p>Mo No:{driver.mobileNo}</p>
                <p>Car No: {driver.carNo}</p> 
                <p>Vehicle Type: {driver.vehicleType}</p>
              </Popup>
            </DynamicMarker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
