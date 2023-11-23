import React from 'react';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, onClick }) => (
  <div className="exercise-card" onClick={onClick}>
    <img src={exercise.gifUrl} alt={exercise.name} />
    <div className="card-content">
      <h3>{exercise.name}</h3>
      <p>{exercise.bodyPart}</p>
      {/* Add more properties as needed */}
    </div>
  </div>
);

export default ExerciseCard;