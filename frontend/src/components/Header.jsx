import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/2.png";
import { navItems } from "../constants/index.jsx";
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const renderDropdown = (isVisible, links) => (
    isVisible && (
      <div className="absolute mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
        {links.map((link, index) => (
          <Link key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    )
  );

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg  border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2 rounded-full" src={logo} alt="logo" />
            <span className="text-xl tracking-tight">CareBridge</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <div className="relative">
              <button 
                className="py-2 px-3 border rounded-md" 
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              >
                Sign In
              </button>
              {renderDropdown(showLoginDropdown, [
                { label: 'As Patient', to: '/login/patient' },
                { label: 'As Doctor', to: '/login/doctor' }
              ])}
            </div>
            <div className="relative">
              <button 
                className="py-2 px-3 border rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-800" 
                onClick={() => setShowSignupDropdown(!showSignupDropdown)}
              >
                Create an account
              </button>
              {renderDropdown(showSignupDropdown, [
                { label: 'As Patient', to: '/signup/patient' },
                { label: 'As Doctor', to: '/signup/doctor' }
              ])}
            </div>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-100 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul className="w-full">
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2 relative">
              <div className="relative">
                <button className="py-2 px-3 border rounded-md" onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
                  Sign In
                </button>
                {renderDropdown(showLoginDropdown, [
                  { label: 'As Patient', to: '/login/patient' },
                  { label: 'As Doctor', to: '/login/doctor' }
                ])}
              </div>
              <div className="relative">
                <button className="py-2 px-3 border rounded-md" onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                  Create an account
                </button>
                {renderDropdown(showSignupDropdown, [
                  { label: 'As Patient', to: '/signup/patient' },
                  { label: 'As Doctor', to: '/signup/doctor' }
                ])}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
