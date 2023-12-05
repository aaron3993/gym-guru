import React from 'react';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, onAddToWorkoutClick }) => (
  <div className="exercise-card">
    <img src={exercise.gifUrl} alt={exercise.name} />
    <div className="card-content">
      <h3>{exercise.updatedName}</h3>
      <h3>{exercise.updatedCategory}</h3>
      <button onClick={() => onAddToWorkoutClick(exercise)}>Add to Workout</button>
    </div>
  </div>
);

export default ExerciseCard;