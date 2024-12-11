import React from "react";

const RoutineCard = ({ routine }) => {
  return (
    <div className="workout-card">
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
