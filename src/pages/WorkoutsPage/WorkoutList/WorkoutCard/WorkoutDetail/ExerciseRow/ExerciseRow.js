import React, { useState } from "react";
import { InputNumber, Alert, message } from "antd";
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
    if (editableReps !== exercise.reps) {
      setRepsError(null);
      updateExerciseInWorkout(
        workoutId,
        exercise.id,
        editableReps,
        exercise.sets
      );
      onUpdateExercise();
      message.success("Reps updated successfully!");
    }
  };

  const handleUpdateSets = () => {
    if (editableSets < 1 || editableSets > 10) {
      return setSetsError("Sets must be between 1 and 10");
    }
    if (editableSets !== exercise.sets) {
      setSetsError(null);
      updateExerciseInWorkout(
        workoutId,
        exercise.id,
        exercise.reps,
        editableSets
      );
      onUpdateExercise();
      message.success("Sets updated successfully!");
    }
  };

  return (
    <div className="exercise-row">
      <div className="exercise-info">
        <img src={exercise.gifUrl} alt={exercise.name} />
        <h3>{exercise.updatedName}</h3>
        <div className="editable-number">
          <span>Reps: </span>
          {isEditingReps ? (
            <InputNumber
              autoFocus
              value={editableReps}
              onChange={(value) => setEditableReps(value)}
              onBlur={handleUpdateReps}
              style={{ width: "60px" }}
            />
          ) : (
            <span onClick={handleEditReps} className="clickable-number">
              {editableReps}
            </span>
          )}
        </div>
        {repsError && <Alert message={repsError} type="error" showIcon />}
        <div className="editable-number">
          <span>Sets: </span>
          {isEditingSets ? (
            <InputNumber
              autoFocus
              value={editableSets}
              onChange={(value) => setEditableSets(value)}
              onBlur={handleUpdateSets}
              style={{ width: "60px" }}
            />
          ) : (
            <span onClick={handleEditSets} className="clickable-number">
              {editableSets}
            </span>
          )}
        </div>
        {setsError && <Alert message={setsError} type="error" showIcon />}
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
    </div>
  );
};

export default ExerciseRow;
