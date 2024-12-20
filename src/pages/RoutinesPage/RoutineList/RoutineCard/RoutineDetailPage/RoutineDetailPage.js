import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { useParams } from "react-router-dom";
import { fetchRoutineWithWorkouts } from "../../../../../utils/firestoreUtils";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import "./RoutineDetailPage.css";

const { Title } = Typography;

const RoutineDetailPage = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [routineTitle, setRoutineTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCardClick = (workout) => {
    navigate(`/workouts/${workout.id}`);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await fetchRoutineWithWorkouts(routineId);
        setWorkouts(data.workouts);
        setRoutineTitle(data.title);
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
    <div>
      <div className="routine-detail-page">
        <div className="header">
          <Title level={1}>{routineTitle}</Title>
        </div>

        <div className="routine-list">
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
      </div>
    </div>
  );
};

export default RoutineDetailPage;
