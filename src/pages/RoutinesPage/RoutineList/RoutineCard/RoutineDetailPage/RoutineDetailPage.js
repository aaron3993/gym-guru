import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWorkoutsByRoutineId } from "../../../../../utils/firestoreUtils";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../components/LoadingSpinner";

const RoutineDetailPage = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardClick = (workout) => {
    navigate(`/workouts/${workout.id}`);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await fetchWorkoutsByRoutineId(routineId);
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [routineId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="workout-card"
          onClick={() => handleCardClick(workout)}
        >
          <h3>{workout.day}</h3>
          <p>{workout.name}</p>
        </div>
      ))}
    </div>
  );
};

export default RoutineDetailPage;
