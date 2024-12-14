import React, { useEffect, useState } from 'react';
import { db } from "../Firebase/Firebase";
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const TrackingApp = () => {
  const [location, setLocation] = useState({ lat: 21.216420, lng: 72.884860 });
  const [status, setStatus] = useState("stopped");
  const [carRunning, setCarRunning] = useState(false);

  useEffect(() => {
    async function fetchData() {
        const carRef = await getDocs(collection(db, "carTracking"));

        carRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setLocation({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
            setStatus(data.status);
            setCarRunning(data.status === "running");
          }
        });
    
        return () => {
          carRef.off();
        };
    }
  }, []);

  return (
    <div>
      <h1>Car Live Tracking</h1>
      <h3>Status: {carRunning ? "Running" : "Stopped"}</h3>
      <p>Start Location: Yogichowk</p>
      <p>End Location: Hirabag</p>
      <div>
        <p>Latitude: {location.lat}</p>
        <p>Longitude: {location.lng}</p>
      </div>

      {/* Google Map to show live location */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default TrackingApp;
