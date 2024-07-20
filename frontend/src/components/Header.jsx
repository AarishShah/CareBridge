import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import useLogout from '../hooks/useLogout'; 
import logo from "../assets/2.png";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const logout = useLogout(); 
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Toggle the state of mobile drawer
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const loginDropdownRef = useRef(null);
  const signupDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
      if (signupDropdownRef.current && !signupDropdownRef.current.contains(event.target)) {
        setShowSignupDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDropdown = (isVisible, links, ref) => (
    isVisible && (
      <div ref={ref} className="absolute mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
        {links.map((link, index) => (
          <Link key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-100" to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    )
  );

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2 rounded-full" src={logo} alt="logo" />
            <span className="text-xl tracking-tight">CareBridge</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <button className="py-2 px-3 border rounded-md" onClick={logout}>
                  Log Out
                </button>
                <button className="py-2 px-3 border rounded-md">
                  My Account
                </button>
              </>
            ) : (
              <div className="flex space-x-2 relative">
                <div className="relative">
                  <button className="py-2 px-3 border rounded-md" onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
                    Sign In
                  </button>
                  {renderDropdown(showLoginDropdown, [
                    { label: 'As Patient', to: '/login/patient' },
                    { label: 'As Doctor', to: '/login/doctor' }
                  ], loginDropdownRef)}
                </div>
                <div className="relative">
                  <button className="py-2 px-3 border rounded-md" onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                    Create an account
                  </button>
                  {renderDropdown(showSignupDropdown, [
                    { label: 'As Patient', to: '/signup/patient' },
                    { label: 'As Doctor', to: '/signup/doctor' }
                  ], signupDropdownRef)}
                </div>
              </div>
            )}
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
              <li><Link to="/">Home</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
            <div className="flex space-x-2 relative">
              {isAuthenticated ? (
                <>
                  <button className="py-2 px-3 border rounded-md" onClick={logout}>
                    Log Out
                  </button>
                  <button className="py-2 px-3 border rounded-md">
                    My Account
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <button className="py-2 px-3 border rounded-md" onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
                      Sign In
                    </button>
                    {renderDropdown(showLoginDropdown, [
                      { label: 'As Patient', to: '/login/patient' },
                      { label: 'As Doctor', to: '/login/doctor' }
                    ], loginDropdownRef)}
                  </div>
                  <div className="relative">
                    <button className="py-2 px-3 border rounded-md" onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                      Create an account
                    </button>
                    {renderDropdown(showSignupDropdown, [
                      { label: 'As Patient', to: '/signup/patient' },
                      { label: 'As Doctor', to: '/signup/doctor' }
                    ], signupDropdownRef)}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
