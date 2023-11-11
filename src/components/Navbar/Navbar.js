import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  signOut } from "firebase/auth";
import {auth} from '../../firebase';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/login");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
  };

  return (
    <nav style={{ background: '#3498db', padding: '10px', color: 'white' }}>
      <Link to="/" style={{ color: 'white', marginRight: '20px' }}>
        Home
      </Link>
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          Logout
        </button>
    </nav>
  );
};

export default Navbar;