// ExerciseList.jsx
import React from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import { displayCategoryName, capitalizeFirstLetter } from '../../utils/formattingUtils';
import './ExerciseList.css';

const ExerciseList = ({ exercises, onItemClick }) => {
  const updatedExercises = exercises.map((exercise) => {
    const displayedCategory = displayCategoryName(exercise.bodyPart);

    // Capitalize the first letter of each word in the exercise name
    const capitalizedExerciseName = capitalizeFirstLetter(exercise.name);

    return {
      ...exercise,
      updatedCategory: displayedCategory !== null ? displayedCategory : exercise.bodyPart,
      updatedName: capitalizedExerciseName,
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
