import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

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

  useEffect(() => {
    // Get current location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            latitude: latitude,
            longitude: longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

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
        console.error("Latitude and Longitude are required.");
        return;
      }

      const docRef = await addDoc(collection(db, "drivers"), {
        ...formData,
        latitude: parseFloat(formData.latitude?.toFixed(6)) || null,
        longitude: parseFloat(formData.longitude?.toFixed(6)) || null,
      });

      console.log("Driver added with ID:", docRef.id);

      // After adding the driver, fetch the updated list of drivers
      const querySnapshot = await getDocs(collection(db, "drivers"));
      const driverData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driverData); // Update the parent component's state

      // Reset form fields
      setFormData({
        name: "",
        mobileNo: "",
        carNo: "",
        licenceNo: "",
        vehicleType: "",
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
        Add New Driver
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

          <button
            type="submit"
            className="w-full text-white py-3 rounded-lg shadow-lg font-semibold bg-gradient-to-r from-gray-500 to-slate-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
