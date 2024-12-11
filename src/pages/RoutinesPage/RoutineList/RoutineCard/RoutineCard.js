import React from "react";

const RoutineCard = ({ routine }) => {
  return (
    <div className="workout-card">
      <h3>{routine.name || "Untitled Routine"}</h3>
      <p>
        <strong>Fitness Level:</strong> {routine.fitnessLevel}
      </p>
      <p>
        <strong>Goal:</strong> {routine.goal}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(routine.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default RoutineCard;
