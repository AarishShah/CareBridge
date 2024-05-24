import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import image from '../assets/2.png';

export default function Header() {
  const navigate = useNavigate();
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-white ml-8 font-sans relative">
      {/* Left navigation links */}
      <div className="flex space-x-8 text-xl">
        <img src={image} alt="logo" className="h-12 w-12 rounded-full" />
        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:underline">Home</button>
        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:underline">Contact</button>
        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:underline">Team</button>
        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:underline">About</button>
      </div>

      <div className="flex space-x-4 mr-6 text-xl relative">
        <div className="relative">
          <button
            className="h-9 w-20 bg-gray-200 rounded transition ease-in-out delay-150 hover:-translate-y-1 hover:bg-gray-300"
            onClick={() => setShowLoginDropdown(!showLoginDropdown)}
          >
            Log in
          </button>
          {showLoginDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20">
              <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to="/login/patient">As Patient</Link>
              <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to="/login/doctor">As Doctor</Link>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="h-9 w-20 bg-gray-200 rounded transition ease-in-out delay-150 hover:-translate-y-1 hover:bg-gray-300"
            onClick={() => setShowSignupDropdown(!showSignupDropdown)}
          >
            Sign up
          </button>
          {showSignupDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20">
              <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to="/signup/patient">As Patient</Link>
              <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to="/signup/doctor">As Doctor</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
