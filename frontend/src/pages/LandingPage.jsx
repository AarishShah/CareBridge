import Header from '../components/Header';
import Moto from '../components/Moto';
import DynamicSection from '../components/DynamicSection';
import GetStarted from '../components/GetStarted';
import Footer from '../components/Footer';
import { useState } from 'react';

function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <>
    <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
    <Moto/>
    <DynamicSection/>
    <GetStarted/>
    <Footer/>
    </>
  )
}

export default LandingPage
