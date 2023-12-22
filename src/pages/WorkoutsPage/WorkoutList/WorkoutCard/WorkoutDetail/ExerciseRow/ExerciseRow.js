import React, { useState } from "react";
import { InputNumber, Alert } from "antd";
import "./ExerciseRow.css";
import { updateExerciseInWorkout } from "../../../../../../utils/firestoreUtils";

const ExerciseRow = ({
  workoutId,
  exercise,
  onRemoveExercise,
  onUpdateExercise,
}) => {
  const [editableReps, setEditableReps] = useState(exercise.reps);
  const [editableSets, setEditableSets] = useState(exercise.sets);
  const [isEditingReps, setIsEditingReps] = useState(false);
  const [isEditingSets, setIsEditingSets] = useState(false);
  const [repsError, setRepsError] = useState(null);
  const [setsError, setSetsError] = useState(null);

  const handleEditReps = () => {
    setIsEditingReps(true);
  };

  const handleEditSets = () => {
    setIsEditingSets(true);
  };

  const handleUpdateReps = () => {
    if (editableReps < 1 || editableReps > 100) {
      return setRepsError("Reps must be between 1 and 100");
    }
    setRepsError(null);
    updateExerciseInWorkout(
      workoutId,
      exercise.id,
      editableReps,
      exercise.sets
    );
    setIsEditingReps(false);
    onUpdateExercise();
  };

  const handleUpdateSets = () => {
    if (editableSets < 1 || editableSets > 10) {
      setSetsError("Sets must be between 1 and 10");
    } else {
      setSetsError(null);
      updateExerciseInWorkout(
        workoutId,
        exercise.id,
        exercise.reps,
        editableSets
      );
      setIsEditingSets(false);
      onUpdateExercise();
    }
  };

  return (
    <div className="exercise-row">
      <div className="exercise-info">
        <img src={exercise.gifUrl} alt={exercise.name} />
        <h3>{exercise.updatedName}</h3>
        <div className="editable-number">
          {isEditingReps ? (
            <InputNumber
              autoFocus
              value={editableReps}
              onChange={(value) => setEditableReps(value)}
              onBlur={handleUpdateReps}
            />
          ) : (
            <span onClick={handleEditReps}>Reps: {editableReps}</span>
          )}
        </div>
        {repsError && <Alert message={repsError} type="error" showIcon />}
        <div className="editable-number">
          {isEditingSets ? (
            <InputNumber
              autoFocus
              value={editableSets}
              onChange={(value) => setEditableSets(value)}
              onBlur={handleUpdateSets}
            />
          ) : (
            <span onClick={handleEditSets}>Sets: {editableSets}</span>
          )}
        </div>
        {setsError && <Alert message={setsError} type="error" showIcon />}
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
    </div>
  );
};

export default ExerciseRow;
