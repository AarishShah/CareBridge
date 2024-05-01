import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'

const Navbar = ({ userType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    if (userType === 'doctor') {
      navigate('/doctor/login', { replace: true });
    } else {
      navigate('/patient/login', { replace: true });
    }
  };
  return (    
    <div className={styles.navbar}>
    <div className={styles.title}>CareBridge</div>
    <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
  </div>
  )
}

export default Navbar
