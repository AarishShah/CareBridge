import image from '../assets/6.png';
import logo from '../assets/2.png';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className="relative">
            <img src={image} alt="" className="w-full h-auto" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black bg-opacity-50">
                <div className="flex items-center space-x-4 mb-8">
                    <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
                    <h1 className="text-white text-xl">For Clinicians</h1>
                    <h1 className="text-white text-xl">Clinical Guidelines</h1>
                    <h1 className="text-white text-xl">Insights</h1>
                    <h1 className="text-white text-xl">Resources</h1>
                    <h1 className="text-white text-xl">About</h1>
                    <h1 className="text-white text-xl">Support</h1>
                </div>
                <div className="flex space-x-4 mb-16">
                    <FaLinkedin className="text-white text-2xl" />
                    <FaTwitter className="text-white text-2xl" />
                    <FaInstagram className="text-white text-2xl" />
                    <FaFacebook className="text-white text-2xl" />
                </div>
                <div>
                    <p className="text-white text-sm">© 2024 Copyright CareBridge All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}
