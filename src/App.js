import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import User from "./pages/User/User";
import PrivateRoute from "./components/PrivateRoute";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import WorkoutsPage from "./pages/WorkoutsPage/WorkoutsPage";
import WorkoutDetailPage from "./pages/WorkoutsPage/WorkoutList/WorkoutCard/WorkoutDetail/WorkoutDetailPage";
import RoutinesPage from "./pages/RoutinesPage/RoutinesPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import { useAuth } from "./contexts/AuthContext";
import RoutineDetailPage from "./pages/RoutinesPage/RoutineList/RoutineCard/RoutineDetailPage/RoutineDetailPage";
import { logEvent, analytics } from "./firebase";
import Layout from "./components/Layout"; // Import the new Layout component

const App = () => {
  const { user, isAuthenticated, isLoading, handleLogout } = useAuth();

  useEffect(() => {
    logEvent(analytics, "user_landed");
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
      />

      <Route
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<User user={user} />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/:workoutId" element={<WorkoutDetailPage />} />
        <Route path="/routines" element={<RoutinesPage />} />
        <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;
