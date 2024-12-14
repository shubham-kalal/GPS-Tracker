import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { db } from "../Firebase/Firebase";
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
const AddDriver = ({ setDrivers }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    carNo: "",
    licenceNo: "",
    vehicleType: "",
    latitude: null,
    longitude: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverId, setDriverId] = useState(null); // Store the driver ID after adding

  useEffect(() => {
    // Get current location when the component mounts and watch for location changes
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location updated:", { latitude, longitude });  // Debugging line
          setFormData((prevData) => ({
            ...prevData,
            latitude: latitude,
            longitude: longitude,
          }));

          // Update Firestore with the new location
          if (driverId) {
            const driverDocRef = doc(db, "drivers", driverId);
            updateDoc(driverDocRef, {
              latitude: latitude,
              longitude: longitude,
            })
              .then(() => {
                console.log("Location successfully updated in Firestore.");
              })
              .catch((err) => {
                console.error("Error updating Firestore:", err);
              });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Cleanup on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [driverId]); // Depend on driverId to start the location watch only after driver is added

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (formData.latitude === null || formData.longitude === null) {
        toast.error("Latitude and Longitude are required.");
        console.error("Latitude and Longitude are required.");
        return;
      }

      // Add the driver to Firestore
      const docRef = await addDoc(collection(db, "drivers"), {
        ...formData,
        latitude: parseFloat(formData.latitude?.toFixed(6)) || null,
        longitude: parseFloat(formData.longitude?.toFixed(6)) || null,
      });
      
      console.log("Driver added with ID:", docRef.id);
      setDriverId(docRef.id);  // Save the driverId for future updates
      // alert('driver added successfuly')

      // Fetch updated list of drivers
      const querySnapshot = await getDocs(collection(db, "drivers"));
      const driverData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driverData); // Update the parent component's state
      toast.success("Drive added successfuly");
      
      // Reset form fields
      setFormData({
        name: "",
        mobileNo: "",
        carNo: "",
        licenceNo: "",
        vehicleType: "",
        from: "",
        to: "",
        latitude: null,
        longitude: null,
      });
    } catch (error) {
      console.error("Error adding driver:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Add New Drive
      </h3>
      <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
        <form onSubmit={handleAddDriver} className="space-y-6">
          {/* Form fields */}
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
              placeholder="Model Name (e.g., Swift, Ertiga)"
              required
            />
          </div>

          <div>
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-600 mb-1">
              From
            </label>
            <input
              type="text"
              id="fromLocation"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From Location Name"
              required
            />
          </div>

          <div>
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-600 mb-1">
              To
            </label>
            <input
              type="text"
              id="toLocation"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className="w-full sm:p-3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To Location Name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-3 rounded-lg shadow-lg font-semibold bg-gradient-to-r from-gray-500 to-slate-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Drive"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
