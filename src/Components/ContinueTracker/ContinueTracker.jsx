let globalWatchId = null;
let previousLocation = null; // Store previous location to compare

// Function to calculate the distance between two latitude/longitude points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;  
};

export const startGlobalTracking = (onLocationUpdate, onError) => {
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

      // Check if the location has changed significantly (e.g., 50 meters)
      if (previousLocation) {
        const distance = calculateDistance(
          previousLocation.latitude,
          previousLocation.longitude,
          latitude,
          longitude
        );

        if (distance > 50) {
          console.log("User's location has changed significantly");
        } else {
          console.log("User's location has not changed");
        }
      }

      // Save the current location as the previous location for the next update
      previousLocation = { latitude, longitude };

      // Execute callback for each location update
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
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
