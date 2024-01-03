import React from "react";
import WorkoutCard from "./WorkoutCard/WorkoutCard";
import "./WorkoutList.css";

const WorkoutList = ({ workouts }) => {
  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
};

export default WorkoutList;
