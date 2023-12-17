import React from "react";
import "./ExerciseRow.css";

const ExerciseRow = ({ exercise, onRemoveExercise }) => {
  return (
    <div className="exercise-row">
      <div className="exercise-info">
        <img src={exercise.gifUrl} alt={exercise.name} />
        <h3>{exercise.updatedName}</h3>
        <h3>Reps: {exercise.reps}</h3>
        <h3>Sets: {exercise.sets}</h3>
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
    </div>
  );
};

export default ExerciseRow;
