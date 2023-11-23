import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Navbar from './components/Navbar/Navbar';
import WorkoutList from './pages/WorkoutList/WorkoutList';
import ExercisePage from './pages/ExercisePage/ExercisePage';

const App = () => {
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
      {isAuthenticated && <Navbar />}
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
            path="/exercises"
            element={
              <ExercisePage />
            }
          />
          <Route
            path="/workouts"
            element={
              <WorkoutList />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
};

export default App;