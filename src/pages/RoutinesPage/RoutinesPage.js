import React, { useState, useEffect } from "react";
import RoutineList from "./RoutineList/RoutineList";
import { getAllRoutinesForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";

const RoutinesPage = () => {
  const { user } = useAuth();
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const routinesData = await getAllRoutinesForUser(user.uid);
        console.log(routinesData);
        setRoutines(routinesData);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, [user.uid]);

  return (
    <div className="routines-page">
      <h1>Your Routines</h1>
      {routines.length > 0 ? (
        <RoutineList routines={routines} />
      ) : (
        <p>No routines found. Start creating one!</p>
      )}
    </div>
  );
};

export default RoutinesPage;
