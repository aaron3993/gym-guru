import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import User from "./pages/User/User";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import WorkoutsPage from "./pages/WorkoutsPage/WorkoutsPage";
import WorkoutDetailPage from "./pages/WorkoutsPage/WorkoutList/WorkoutCard/WorkoutDetail/WorkoutDetailPage";
import RoutinesPage from "./pages/RoutinesPage/RoutinesPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import { useAuth } from "./contexts/AuthContext";
import RoutineDetailPage from "./pages/RoutinesPage/RoutineList/RoutineCard/RoutineDetailPage/RoutineDetailPage";
import { logEvent, analytics } from "./firebase";

const App = () => {
  const { user, isAuthenticated, isLoading, handleLogout } = useAuth();

  useEffect(() => {
    logEvent(analytics, "user_landed");
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />}
        />
        <Route
          path="/home"
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
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
        />
      </Routes>
    </>
  );
};

export default App;
