// ExerciseList.jsx
import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import {
  displayCategoryName,
  capitalizeFirstLetter,
} from '../../utils/dataUtils';
import { addExerciseToWorkout } from '../../utils/firestoreUtils';
import './ExerciseList.css';

const ExerciseList = ({ exercises, workouts, isWorkoutDetailPage, onAddToWorkout }) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const handleWorkoutChange = (event) => {
    setSelectedWorkoutId(event.target.value);
  };

  const updatedExercises = exercises.map((exercise) => {
    const displayedCategory = displayCategoryName(exercise.bodyPart);
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
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          workouts={workouts}
          isWorkoutDetailPage={isWorkoutDetailPage}
          onAddToWorkout={onAddToWorkout}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
