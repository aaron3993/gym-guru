import React from "react";
import { useNavigate } from "react-router-dom";

const RoutineCard = ({ routine }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/routines/${routine.id}`);
  };

  return (
    <div className="workout-card" onClick={handleCardClick}>
      <h3>{routine.title}</h3>
      <p>
        <strong>Fitness Level:</strong> {routine.fitnessLevel}
      </p>
      <p>
        <strong>Goal:</strong> {routine.goal}
      </p>
    </div>
  );
};

export default RoutineCard;
