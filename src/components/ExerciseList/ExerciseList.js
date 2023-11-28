import React from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import { displayCategoryName } from '../../utils/formattingUtils';
import './ExerciseList.css';

const ExerciseList = ({ exercises, onItemClick }) => {
  const updatedExercises = exercises.map((exercise) => {
    const displayedCategory = displayCategoryName(exercise.bodyPart);
    return {
      ...exercise,
      updatedCategory: displayedCategory !== null ? displayedCategory : exercise.bodyPart,
    };
  });

  return (
    <div className="exercise-list">
      {updatedExercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} onClick={() => onItemClick(exercise)} />
      ))}
    </div>
  );
};

export default ExerciseList;