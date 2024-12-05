import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import Navbar from '../Navbar/Navbar';
import DriverList from '../DriverList/DriverList';
import AddDriver from '../AddDriver/AddDriver';
import MapView from '../MapView/MapView';
import { db } from '../Firebase/Firebase';  
import { collection, onSnapshot } from 'firebase/firestore';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('Dashboard');
  const [drivers, setDrivers] = useState([]); // State to hold the drivers

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
  };

  // Fetch drivers from Firestore when the component mounts
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const driversList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driversList);
    });
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <SideBar isSidebarOpen={isSidebarOpen} onFieldClick={handleFieldClick} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`sm:ml-[266px] mt-16 ${isSidebarOpen ? "ml-[266px]" : "ml-0"}`}>
        {selectedField === 'Dashboard' && <MapView />}
        {selectedField === 'DriverList' && <DriverList drivers={drivers} />}
        {selectedField === 'AddDriver' && <AddDriver setDrivers={setDrivers} />}
      </div>
    </div>
  );
};

export default Dashboard;
