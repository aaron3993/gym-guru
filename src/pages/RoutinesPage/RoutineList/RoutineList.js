import React from "react";
import RoutineCard from "./RoutineCard/RoutineCard";

const RoutineList = ({ routines }) => {
  return (
    <div className="workout-list">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
};

export default RoutineList;
