import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Navbar from './components/Navbar/Navbar';
import WorkoutList from './pages/WorkoutsPage/WorkoutList/WorkoutList';
import ExercisesPage from './pages/ExercisesPage/ExercisesPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoadingSpinner from './components/LoadingSpinner';
import WorkoutsPage from './pages/WorkoutsPage/WorkoutsPage';

const theme = createTheme();

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false)
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    try {
      setAuthenticated(false)
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
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
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ExercisesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WorkoutsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      </ThemeProvider>
  );
};

export default App;