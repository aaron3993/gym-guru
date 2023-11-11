import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
// import 'firebase/auth';
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Navbar = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log({user})
            setAuthenticated(true);
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
        }
      });
  }, []);

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
      {isAuthenticated && (
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;