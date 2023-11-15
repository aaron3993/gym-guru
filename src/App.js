import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

const App = () => {
  console.log('app');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log({ user });
        setAuthenticated(true);
      }
      setLoading(false);
    });

    return () => {
      // Unsubscribe when the component is unmounted
      unsubscribe();
    };
  }, []);

  // Render loading indicator or the application based on the isLoading state
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;