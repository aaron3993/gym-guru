import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import User from "./pages/User/User";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingSpinner from "./components/LoadingSpinner";
import WorkoutsPage from "./pages/WorkoutsPage/WorkoutsPage";
import WorkoutDetailPage from "./pages/WorkoutsPage/WorkoutList/WorkoutCard/WorkoutDetail/WorkoutDetailPage";
import RoutinesPage from "./pages/RoutinesPage/RoutinesPage";
import { useAuth } from "./contexts/AuthContext";
import RoutineDetailPage from "./pages/RoutinesPage/RoutineList/RoutineCard/RoutineDetailPage/RoutineDetailPage";
import { logEvent, analytics } from "./firebase";

const theme = createTheme();

const App = () => {
  const { user, isAuthenticated, isLoading, handleLogout } = useAuth();

  useEffect(() => {
    logEvent(analytics, "user_landed");
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <User user={user} />
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
          path="/workouts/:workoutId"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <WorkoutDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/routines"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoutinesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/routines/:routineId"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoutineDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
