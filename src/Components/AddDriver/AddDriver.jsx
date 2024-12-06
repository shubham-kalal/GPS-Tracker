import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/Firebase'; // Ensure the correct path
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'; // Import doc and updateDoc from Firebase

const AddDriver = ({ setDrivers }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    carNo: '',
    licenceNo: '',
    vehicleType: '',
    latitude: null, // Latitude field
    longitude: null, // Longitude field
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track if form is submitting
  const [driverId, setDriverId] = useState(null); // Track the driver's ID after adding

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
  
          // Log the new location to the console
          console.log("New location:", { latitude, longitude, accuracy });
  
          // Update the driver's location in the state
          setFormData((prevData) => ({
            ...prevData,
            latitude,
            longitude,
            accuracy, // Optional: store accuracy if needed
          }));
  
          // Log the updated location data in state
          console.log("Updated formData state:", formData);
  
          // Update Firebase with the new location
          if (driverId) {
            const driverRef = doc(db, "drivers", driverId); // Reference to the driver's document
            updateDoc(driverRef, {
              latitude,
              longitude,
            }).then(() => {
              console.log("Driver location updated in Firebase:", { latitude, longitude });
            }).catch((error) => {
              console.error("Error updating location in Firebase:", error);
            });
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Location permission is required for this feature.");
        },
        {
          enableHighAccuracy: true,  // Optional: use higher accuracy
          maximumAge: 0,             // Get the most recent position
          timeout: 10000,            // Timeout if no location found within 10 seconds
        }
      );
  
      // Cleanup function to stop watching when the component unmounts
      return () => {
        console.log('Geolocation watch cleared');
      };
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [driverId]); // Ensure this effect runs when driverId is set

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true); // Set submitting state to true

    // Ensure latitude and longitude are numbers
    let { latitude, longitude } = formData;

    if (latitude === null || longitude === null) {
      alert('Location data is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Add the new driver to Firebase Firestore
      const docRef = await addDoc(collection(db, 'drivers'), {
        name: formData.name,
        mobileNo: formData.mobileNo,
        carNo: formData.carNo,
        licenceNo: formData.licenceNo,
        vehicleType: formData.vehicleType,
        latitude: parseFloat(latitude.toFixed(6)),  // Ensure precision
        longitude: parseFloat(longitude.toFixed(6)),
      });

      console.log('Document written with ID: ', docRef.id);

      // Save the driverId for real-time location updates
      setDriverId(docRef.id);

      // Update the parent component state (add the new driver to the driver list)
      const newDriver = {
        id: docRef.id,
        name: formData.name,
        mobileNo: formData.mobileNo,
        carNo: formData.carNo,
        licenceNo: formData.licenceNo,
        vehicleType: formData.vehicleType,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      setDrivers((prevDrivers) => [...prevDrivers, newDriver]);

      // Reset the form
      setFormData({
        name: '',
        mobileNo: '',
        carNo: '',
        licenceNo: '',
        vehicleType: '',
        latitude: null,
        longitude: null,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setIsSubmitting(false); // Reset the submitting flag after the request is completed
    }
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold text-center text-gray-700 mb-6">Add New Driver</h3>

      <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
        <form onSubmit={handleAddDriver} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter driver's name"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-600 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mobile number"
              required
            />
          </div>

          {/* Vehicle Number Field */}
          <div>
            <label htmlFor="carNo" className="block text-sm font-medium text-gray-600 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              id="carNo"
              name="carNo"
              value={formData.carNo}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vehicle number"
              required
            />
          </div>

          {/* License Number Field */}
          <div>
            <label htmlFor="licenceNo" className="block text-sm font-medium text-gray-600 mb-1">
              License Number
            </label>
            <input
              type="text"
              id="licenceNo"
              name="licenceNo"
              value={formData.licenceNo}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter license number"
            />
          </div>

          {/* Vehicle Type Field */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-600 mb-1">
              Model Name
            </label>
            <input
              type="text"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Model Name (Swift, Ertiga)"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white py-3 rounded-lg shadow-lg font-semibold bg-gradient-to-r from-gray-500 to-slate-500"
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? "Adding..." : "Add Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
