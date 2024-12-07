import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

let globalWatchId = null;
let globalInterval = null; // To manage the interval
let previousLocation = null;

// Function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

export const startGlobalTracking = (onLocationUpdate, onError, driverId) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by your browser.");
    return;
  }

  if (globalWatchId) {
    console.log("Tracking is already active.");
    return;
  }

  globalWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Location updated:", { latitude, longitude });

      if (previousLocation) {
        const distance = calculateDistance(
          previousLocation.latitude,
          previousLocation.longitude,
          latitude,
          longitude
        );

        if (distance > 50) {
          console.log("Significant location change detected.");
        }
      }

      previousLocation = { latitude, longitude };

      // Callback for location updates
      if (onLocationUpdate) {
        onLocationUpdate({ latitude, longitude });
      }
    },
    (error) => {
      console.error("Error getting location:", error);
      if (onError) {
        onError(error);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );

  // Firestore update every 3 seconds
  globalInterval = setInterval(() => {
    if (previousLocation && driverId) {
      const driverDocRef = doc(db, "drivers", driverId);
      updateDoc(driverDocRef, {
        latitude: previousLocation.latitude,
        longitude: previousLocation.longitude,
      }).catch((err) => console.error("Error updating Firestore:", err));
    }
  }, 3000); // Every 3 seconds
};

// Stop tracking
export const stopGlobalTracking = () => {
  if (globalWatchId) {
    navigator.geolocation.clearWatch(globalWatchId);
    globalWatchId = null;
  }
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
};
