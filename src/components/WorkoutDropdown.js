// WorkoutDropdown.jsx

import React from 'react';

const WorkoutDropdown = ({ workouts, selectedWorkoutId, onSelectWorkout }) => {
  return (
    <select onChange={onSelectWorkout} value={selectedWorkoutId}>
      <option value={null}>Select Workout</option>
      {workouts.map((workout) => (
        <option key={workout.id} value={workout.id}>
          {workout.name}
        </option>
      ))}
    </select>
  );
};

export default WorkoutDropdown;
