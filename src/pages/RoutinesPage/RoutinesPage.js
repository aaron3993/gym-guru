import React, { useState, useEffect } from "react";
import RoutineList from "./RoutineList/RoutineList";
import { getAllRoutinesForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

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
      <h1>Your Routines</h1>
      {loading ? (
        <LoadingSpinner />
      ) : routines.length > 0 ? (
        <RoutineList routines={routines} />
      ) : (
        <p>No routines found. Start creating one!</p>
      )}
    </div>
  );
};

export default RoutinesPage;
