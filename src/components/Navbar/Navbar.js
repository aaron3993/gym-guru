import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      })
      .finally(() => {
        setLogoutConfirmation(false);
      });
  };

  const cancelLogout = () => {
    setLogoutConfirmation(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/exercises" className="nav-link">
          Exercises
        </Link>
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
      </div>
      <div className="logout-btn-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {logoutConfirmation && (
        <div className="logout-confirmation">
          <p>Are you sure you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>No</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;