// ExerciseList.jsx
import React from 'react';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import { displayCategoryName, capitalizeFirstLetter, addExerciseToWorkout } from '../../utils/formattingUtils';
import './ExerciseList.css';

const ExerciseList = ({ exercises, workoutId }) => {
  const handleAddToWorkoutClick = async (exercise) => {
    try {
      // Call the function to add the exercise to the workout
      console.log(workoutId, exercise.id)
      await addExerciseToWorkout(workoutId, exercise.id);
      console.log(`Exercise ${exercise.name} added to the workout!`);
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
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
          onAddToWorkoutClick={() => handleAddToWorkoutClick(exercise)}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
