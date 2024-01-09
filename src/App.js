import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingSpinner from "./components/LoadingSpinner";
import WorkoutsPage from "./pages/WorkoutsPage/WorkoutsPage";
import WorkoutDetailPage from "./pages/WorkoutsPage/WorkoutList/WorkoutCard/WorkoutDetail/WorkoutDetailPage";
import { useAuth } from "./contexts/AuthContext";

const theme = createTheme();

const App = () => {
  const { user, isAuthenticated, isLoading, handleLogout } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
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
          {/* <Route
            path="/exercises"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ExercisesPage />
              </PrivateRoute>
            }
          /> */}
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
