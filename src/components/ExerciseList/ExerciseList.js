import React from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';

const ExerciseList = ({ exercises, onItemClick }) => (
  <div className="exercise-list">
    {exercises.map((exercise) => (
      <ExerciseCard key={exercise.id} exercise={exercise} onClick={() => onItemClick(exercise)} />
    ))}
  </div>
);

export default ExerciseList;