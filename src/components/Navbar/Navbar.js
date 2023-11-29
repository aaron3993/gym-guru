import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout, user }) => {
  console.log({user})
  const navigate = useNavigate()

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
      <div className="user-logout-container">
        <div className='user-logout-sub-container'>
          <span className="user-name">{user.displayName}</span>
          <button className="logout-btn" onClick={async () => {
            await onLogout()
            navigate('/login')
          }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;