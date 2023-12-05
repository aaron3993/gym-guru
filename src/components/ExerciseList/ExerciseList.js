// ExerciseList.jsx
import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import {
  displayCategoryName,
  capitalizeFirstLetter,
} from '../../utils/dataUtils';
import { addExerciseToWorkout } from '../../utils/firestoreUtils';
import './ExerciseList.css';

const ExerciseList = ({ exercises, workouts, isWorkoutDetailPage}) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const handleAddToWorkoutClick = async (exercise) => {
    try {
      // Check if a workout is selected
      if (!selectedWorkoutId) {
        console.error('No workout selected.');
        return;
      }

      // Call the function to add the exercise to the selected workout
      await addExerciseToWorkout(selectedWorkoutId, exercise.id);
      console.log(`Exercise ${exercise.name} added to the workout!`);
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
  };

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
          // onAddToWorkoutClick={handleAddToWorkoutClick}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
