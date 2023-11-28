import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Navbar from './components/Navbar/Navbar';
import WorkoutList from './pages/WorkoutList/WorkoutList';
import ExercisePage from './pages/ExercisePage/ExercisePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';

const theme = createTheme();

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false)
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    try {
      setAuthenticated(false)
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
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
                <ExercisePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WorkoutList />
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