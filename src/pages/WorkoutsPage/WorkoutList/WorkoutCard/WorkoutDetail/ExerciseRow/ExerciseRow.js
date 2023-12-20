import React, { useState } from "react";
import { updateExerciseInWorkout } from "../../../../../../utils/firestoreUtils";
import "./ExerciseRow.css";

const ExerciseRow = ({
  exercise,
  currentWorkout,
  onRemoveExercise,
  onUpdateExercise,
}) => {
  const [editableReps, setEditableReps] = useState(exercise.reps);
  const [editableSets, setEditableSets] = useState(exercise.sets);

  const handleRepsChange = (e) => {
    const newReps = e.target.value;
    setEditableReps(newReps);
  };

  const handleSetsChange = (e) => {
    const newSets = e.target.value;
    setEditableSets(newSets);
  };

  const handleUpdateExercise = () => {
    updateExerciseInWorkout(
      currentWorkout.id,
      exercise.id,
      editableReps,
      editableSets
    );
  };

  return (
    <div className="exercise-row">
      <div className="exercise-info">
        <img src={exercise.gifUrl} alt={exercise.name} />
        <h3>{exercise.updatedName}</h3>
        <label>
          Reps:
          <input
            type="number"
            value={editableReps}
            onChange={handleRepsChange}
          />
        </label>
        <label>
          Sets:
          <input
            type="number"
            value={editableSets}
            onChange={handleSetsChange}
          />
        </label>
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
      <button onClick={handleUpdateExercise}>Update</button>
    </div>
  );
};

export default ExerciseRow;
