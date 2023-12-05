// ExerciseCard.jsx

import React from 'react';
import WorkoutDropdown from '../../WorkoutDropdown';
import { addExerciseToWorkout } from '../../../utils/firestoreUtils';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, workouts, isWorkoutDetailPage }) => {
  const handleAddToWorkoutClick = async () => {
    try {
      // Assuming you have access to the workoutId in your component's state or props
      const workoutId = 'exampleWorkoutId'; // Replace with the actual workoutId

      // Call the function to add the exercise to the selected workout
      await addExerciseToWorkout(workoutId, exercise.id);
      console.log(`Exercise ${exercise.name} added to the workout!`);
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
  };

  return (
    <div className="exercise-card">
      <img src={exercise.gifUrl} alt={exercise.name} />
      <div className="card-content">
        <h3>{exercise.updatedName}</h3>
        <h3>{exercise.updatedCategory}</h3>
        
        {isWorkoutDetailPage ? (
          // Render button for WorkoutDetailPage
          <button onClick={handleAddToWorkoutClick}>Add to Workout</button>
        ) : (
          // Render dropdown for ExercisesPage
          <WorkoutDropdown workouts={workouts} />
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
