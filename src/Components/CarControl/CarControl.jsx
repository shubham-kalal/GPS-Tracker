import React, { useState } from 'react';
import { db } from "../Firebase/Firebase";
import { addDoc, collection } from "firebase/firestore";

const CarControl = () => {
  const [carStatus, setCarStatus] = useState("running");
  const [watchId, setWatchId] = useState(null);

  const handleStart = async () => {
    console.log("carStatus:", carStatus);
    if (navigator.geolocation && carStatus === "running") {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Location updated:", { latitude, longitude });  // Debugging line

                addDoc(collection(db, "carTracking"), {
                    latitude: parseFloat(latitude) || null,
                    longitude: parseFloat(longitude) || null,
                    status: "running",
                    timestamp: Date.now(),
                });
                setCarStatus("running");
            },
            (error) => {
              console.error("Error getting location:", error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        setWatchId(watchId);

        // Cleanup on component unmount
        // return () => {
        //     navigator.geolocation.clearWatch(watchId);
        // };
    };
  };

  const handleStop = () => {
    if (navigator.geolocation) {
        const currentPosition = navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("stope Location updated:", { latitude, longitude });  // Debugging line

                addDoc(collection(db, "carTracking"), {
                    latitude: parseFloat(latitude) || null,
                    longitude: parseFloat(longitude) || null,
                    status: "stopped",
                    timestamp: Date.now(),
                });
                setCarStatus("stopped");

                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId); // Stop watching
                    setWatchId(null); // Reset the watch ID
                }
            },
            (error) => {
              console.error("Error getting location:", error);
            },
            // { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        console.log("currentPosition--->", currentPosition);

        // Cleanup on component unmount
        // return () => {
        //     navigator.geolocation.clearWatch(watchId);
        // };
    };
  };

  return (
    <div>
        <h3 style={{fontSize: "30px", textAlign: "center"}}>Car Control</h3>
        <p style={{fontSize: "20px"}}>Current Status: <strong>{carStatus}</strong></p>
        {/* <button onClick={handleStart}>Start Car</button>
        <button onClick={handleStop}>Stop Car</button> */}
        <div style={{marginTop: "20px"}}>
            <button type="button" className="re-start-btn rounded-lg font-semibold" onClick={handleStart}>
                Start Car
            </button>
            <button type="button" className="re-btn rounded-lg font-semibold" onClick={handleStop}>
                Stop Car
            </button>
        </div>
    </div>
  );
};

export default CarControl;
