import React from 'react';
import Header from '../Header';
import Sidebar from '../ui/Sidebar';
import image from '../../assets/8.png';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const userType = location.pathname.includes("doctor") ? "doctor" : "patient";

  return (
    <div>
      <Header />
      <div 
        className="relative flex h-screen"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Sidebar userType={userType} />
       
      </div>
    </div>
  );
};

export default Dashboard;
