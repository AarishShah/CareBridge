import image from '../assets/6.png';
import logo from '../assets/2.png';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className="relative">
            <img src={image} alt="" className="w-full h-auto" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8 bg-black bg-opacity-50">
                {/* Only display the menu items on md screens and above */}
                <div className="hidden md:flex items-center justify-center space-x-4 mb-8">
                    <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
                    <h1 className="text-white text-lg">For Clinicians</h1>
                    <h1 className="text-white text-lg">Clinical Guidelines</h1>
                    <h1 className="text-white text-lg">Insights</h1>
                    <h1 className="text-white text-lg">Resources</h1>
                    <h1 className="text-white text-lg">About</h1>
                    <h1 className="text-white text-lg">Support</h1>
                </div>
                <div className="flex space-x-4 mb-8">
                    <FaLinkedin className="text-white text-2xl" />
                    <FaTwitter className="text-white text-2xl" />
                    <FaInstagram className="text-white text-2xl" />
                    <FaFacebook className="text-white text-2xl" />
                </div>
                <div className="w-full text-center">
                    <p className="text-white text-sm">© 2024 Copyright CareBridge All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}
