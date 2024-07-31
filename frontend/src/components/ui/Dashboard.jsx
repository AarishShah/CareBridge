import { useState } from 'react';
import Header from '../Header';
import Sidebar from '../ui/Sidebar';
import image from '../../assets/8.png';
import { useLocation } from 'react-router-dom';
import Images from './Images';
import patientImagesData from './patientImagesData';
import doctorImagesData from './doctorImagesData';

const Dashboard = () => {
  const location = useLocation();
  const userType = location.pathname.includes("doctor") ? "doctor" : "patient";
  const imagesData = userType === "doctor" ? doctorImagesData : patientImagesData;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className='relative h-screen overflow-hidden'> 
      <Header />
      <div 
        className="flex h-screen"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <Sidebar userType={userType} hoveredIndex={hoveredIndex} className="sticky top-0 h-full" />
        <div className="flex-grow no-scrollbar overflow-hidden hover:overflow-scroll h-full p-4 bg-transparent">
          <Images images={imagesData} setHoveredIndex={setHoveredIndex}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
