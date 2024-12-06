let globalWatchId = null;

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

export const stopGlobalTracking = () => {
  if (globalWatchId !== null) {
    navigator.geolocation.clearWatch(globalWatchId);
    console.log("Tracking stopped.");
    globalWatchId = null;
  }
};
