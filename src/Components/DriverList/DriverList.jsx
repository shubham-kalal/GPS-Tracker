import React from 'react';
import { db } from '../Firebase/Firebase'; // Import the Firestore database
import { doc, deleteDoc } from 'firebase/firestore'; // Firestore delete method

const DriverList = ({ drivers, setDrivers }) => {
  
  const handleRemoveDriver = async (driverId) => {
    try {
      // Delete driver from Firebase Firestore
      const driverDocRef = doc(db, 'drivers', driverId);
      await deleteDoc(driverDocRef);

      // Remove the driver from the local state
      setDrivers((prevDrivers) => prevDrivers.filter(driver => driver.id !== driverId));

      console.log('Driver removed successfully');
    } catch (error) {
      console.error('Error removing driver: ', error);
    }
  };

  return (
    <div className="p-2 bg-gray-50 -z-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 text-center sm:mb-10 mb-5">Driver List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {drivers.map((driver, index) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-gray-200 to-slate-200 p-4 rounded-t-lg">
              <h3 className="text-gray-800 text-xl font-semibold">{`${index + 1}. ${driver.name}`}</h3>
            </div>

            <div className="mt-4 p-4 text-gray-800">
              <div className="flex justify-between">
                <p className="text-sm">Mobile No:</p>
                <p className="font-semibold">{driver.mobileNo}</p>
              </div>

              <div className="flex justify-between mt-2">
                <p className="text-sm">Vehicle Type:</p>
                <p className="font-semibold">{driver.vehicleType}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm">Vehicle No:</p>
                <p className="font-semibold">{driver.carNo}</p>
              </div>
            </div>

            <div className="mt-6 text-center pb-4">
              <button
                onClick={() => handleRemoveDriver(driver.id)} // Call the handleRemoveDriver function
                className="text-white px-6 py-2 rounded-full shadow-md bg-gradient-to-r from-gray-500 to-slate-500 transition duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;
