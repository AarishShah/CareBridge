import React from 'react';
import Header from '../Header';
import backgroundImage from '../../assets/8.png'; // Adjust the path as necessary

function ContactForm() {
    return (
        <>
        <Header/>
        <div className="relative text-center p-5 h-screen">
            <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover" alt="Background" />
            <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md">
                <h1 className="text-black text-4xl font-bold mb-2">CareBridge Cares</h1>
                <p className="text-black text-lg mb-2">Your health is our top priority. Reach out to us anytime, we're here to help!</p>
                
                    <p className="text-black text-lg mb-2">📧 Email: carebridge56@gmail.com</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default ContactForm;
