import React from "react";
import { useNavigate } from "react-router-dom";
import "./WorkoutCard.css";

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workouts/${workout.id}`);
  };

  return (
    <div className="workout-card" onClick={handleCardClick}>
      <h3>{workout.name}</h3>
    </div>
  );
};

export default WorkoutCard;
