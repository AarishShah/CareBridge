import React from 'react';
import backgroundImage from '../../assets/8.png'; // Ensure the path matches your project structure
import Header from '../Header';
const AboutPage = () => {
    return (
        <>
          <Header/>
      <div className="min-h-screen flex flex-col justify-center items-center p-4"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        <div className="bg-white bg-opacity-75 shadow-xl p-6 rounded-lg text-center">
          <h1 className="text-3xl font-semibold text-gray-800">About CareBridge</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            CareBridge is a state-of-the-art Clinical Decision Support System designed to
            enhance healthcare delivery by providing critical insights and analytics at the point of care.
            Our system integrates seamlessly with existing healthcare infrastructures, offering
            real-time data analysis to support clinical decisions.
          </p>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-700">Our Mission</h3>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
              Our mission is to empower healthcare providers with innovative tools that improve the quality of care,
              enhance patient outcomes, and optimize clinical workflows.
            </p>
          </div>
        </div>
      </div>
      </>
    );
  };
  
  export default AboutPage;
