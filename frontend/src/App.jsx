import React from 'react';
import Header from './components/Header';
import Moto from './components/Moto';
import DynamicSection from './components/DynamicSection';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';

function App() {
  return (
    <div>
    <Header/>
    <Moto/>
    <DynamicSection/>
    <GetStarted/>
    <Footer/>
    </div>
  );
}

export default App;