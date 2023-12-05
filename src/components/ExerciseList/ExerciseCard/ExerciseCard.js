import React from 'react';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, onClick }) => (
  <div className="exercise-card" onClick={onClick}>
    <img src={exercise.gifUrl} alt={exercise.name} />
    <div className="card-content">
      <h3>{exercise.updatedName}</h3>
      <h3>{exercise.updatedCategory}</h3>
    </div>
  </div>
);

export default ExerciseCard;