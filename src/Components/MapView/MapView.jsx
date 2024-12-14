import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "../Firebase/Firebase";
import { collection, onSnapshot } from "firebase/firestore";

const containerStyle = {
  width: '95%',
  height: '85%',
};

const createRedIcon = (color) => {
  return new L.divIcon({
    className: "leaflet-div-icon",
    html: `<div style="font-size: 1.5em; color: ${color} ">🚗</div>`,
    iconSize: [30, 30],
  });
};

const createGreenIcon = (color) => {
  return new L.divIcon({
    className: "leaflet-div-icon",
    html: `<div style="font-size: 1.5em; color: ${color} ">🚓</div>`,
    iconSize: [30, 30],
  });
};

const MapView = ({role}) => {
  const [drivers, setDrivers] = useState([]);
  const [location, setLocation] = useState({ lat: 21.216420, lng: 72.884860 });
  const [carRunning, setCarRunning] = useState(false);
  const [carStatus, setCarStatus] = useState("Stopped");
  const [watchId, setWatchId] = useState(null);
  const [icon, setIcon] = useState(createRedIcon("red"));

  useEffect(() => {
    async function fetchData() {      
      const driversCollectionRef = collection(db, "drivers");
      const unsubscribe = onSnapshot(driversCollectionRef, (snapshot) => {
        const driversData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrivers(driversData);
      });
  
      return () => {
        unsubscribe();
      };
    };
    fetchData();
  }, [drivers]);

  const handleStart = async () => {
    if (navigator.geolocation) {
      const watchLocationId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location updated:", { latitude, longitude });  // Debugging line

          setLocation({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude)
          });

          setCarStatus("Running");
          setCarRunning(true);
          setIcon(createGreenIcon("green"));

          // addDoc(collection(db, "carTracking"), {
          //     latitude: parseFloat(latitude) || null,
          //     longitude: parseFloat(longitude) || null,
          //     status: "Running",
          //     timestamp: Date.now(),
          // });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setWatchId(watchLocationId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleStop = () => {
    setCarStatus("Stopped");
    setCarRunning(false);
    setIcon(createRedIcon("red"));
    if (navigator.geolocation) {
      const currentPosition = navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("stope Location updated:", { latitude, longitude });  // Debugging line

          setLocation({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude)
          });

          // addDoc(collection(db, "carTracking"), {
          //     latitude: parseFloat(latitude) || null,
          //     longitude: parseFloat(longitude) || null,
          //     status: "Stopped",
          //     timestamp: Date.now(),
          // });

          if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId); // Stop watching
              setWatchId(null); // Reset the watch ID
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
      console.log("currentPosition--->", currentPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // useEffect(() => {
  //   if (drivers.length > 0) {
  //     const avgLat = drivers.reduce((sum, d) => sum + d.latitude, 0) / drivers.length;
  //     const avgLon = drivers.reduce((sum, d) => sum + d.longitude, 0) / drivers.length;
  //     setMapCenter([avgLat, avgLon]);
  //   }
  // }, [drivers]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {role === 'user' ? (
        <>
          <div>
            <h3 style={{fontSize: "30px", textAlign: "center"}}>Car Control</h3>
            <p style={{fontSize: "20px"}}>Current Status: <strong>{carStatus}</strong></p>
            <div style={{marginTop: "20px"}}>
                <button type="button" className="re-start-btn rounded-lg font-semibold" onClick={handleStart}>
                    Start Car
                </button>
                <button type="button" className="re-btn rounded-lg font-semibold" onClick={handleStop}>
                    Stop Car
                </button>
            </div>
          </div>
        </>
      ):(
        <>
          <MapContainer center={location} zoom={15} style={containerStyle}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {drivers.map(
              (driver) =>
                driver.latitude &&
                driver.longitude && (
                  <Marker key={driver.id} position={{
                    lat: parseFloat(driver.latitude),
                    lng: parseFloat(driver.longitude)
                  }} icon={icon}>
                    <Popup>
                      <strong>{driver.name}</strong>
                      <p>Mobile: {driver.mobileNo}</p>
                      <p>Status: {carRunning ? "Running" : "Stopped"}</p>
                      <p>From: <strong>{driver.from}</strong></p>
                      <p>To: <strong>{driver.to}</strong></p>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </>
      )}      
    </div>
  );
};

export default MapView;
