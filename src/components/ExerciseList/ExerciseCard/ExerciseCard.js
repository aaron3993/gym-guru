// ExerciseCard.jsx

import React from 'react';
import WorkoutDropdown from '../../WorkoutDropdown';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, workouts, isWorkoutDetailPage, onAddToWorkout }) => {

  return (
    <div className="exercise-card">
      <img src={exercise.gifUrl} alt={exercise.name} />
      <div className="card-content">
        <h3>{exercise.updatedName}</h3>
        <h3>{exercise.updatedCategory}</h3>
        
        {isWorkoutDetailPage ? (
          <button onClick={() => onAddToWorkout(exercise.id)}>Add to Workout</button>
        ) : (
          <WorkoutDropdown workouts={workouts} />
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
