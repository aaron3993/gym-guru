import React, { useState, useEffect } from "react";
import RoutineList from "./RoutineList/RoutineList";
import { getAllRoutinesForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./RoutinesPage.css";

const RoutinesPage = () => {
  const { user } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const routinesData = await getAllRoutinesForUser(user.uid);
        console.log(routinesData);
        setRoutines(routinesData);
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [user.uid]);

  return (
    <div className="routines-page">
      <div className="header">
        <h1>Your Routines</h1>
        <p>View your AI-generated routines.</p>
      </div>
      <div className="content">
        {loading ? (
          <LoadingSpinner />
        ) : routines.length > 0 ? (
          <RoutineList routines={routines} />
        ) : (
          <p>No routines found. Start creating one!</p>
        )}
      </div>
    </div>
  );
};

export default RoutinesPage;
