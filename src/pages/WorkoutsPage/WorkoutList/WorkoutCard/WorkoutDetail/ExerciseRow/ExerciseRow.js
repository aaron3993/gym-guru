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
    setIsEditingReps(false);
    setRepsError(null);
    if (editableReps !== exercise.reps) {
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
    setIsEditingSets(false);
    setSetsError(null);
    if (editableSets !== exercise.sets) {
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

  const handleKeyDown = (e, updateFunction) => {
    if (e.key === "Enter") {
      updateFunction();
    }
  };

  return (
    <div className="exercise-row">
      <div className="exercise-info">
        <img src={exercise.gifUrl} alt={exercise.name} />
        <h3>{exercise.updatedName}</h3>
        <div className="editable-number">
          <h3>Sets</h3>
          {isEditingSets ? (
            <InputNumber
              autoFocus
              value={editableSets}
              onChange={(value) => setEditableSets(value)}
              onBlur={handleUpdateSets}
              onKeyDown={(e) => handleKeyDown(e, handleUpdateSets)}
            />
          ) : (
            <p onClick={handleEditSets} className="clickable-number">
              {editableSets}
            </p>
          )}
        </div>
        {setsError && <Alert message={setsError} type="error" showIcon />}
        <div className="editable-number">
          <h3>Reps</h3>
          {isEditingReps ? (
            <InputNumber
              autoFocus
              value={editableReps}
              onChange={(value) => setEditableReps(value)}
              onBlur={handleUpdateReps}
              onKeyDown={(e) => handleKeyDown(e, handleUpdateReps)}
            />
          ) : (
            <p onClick={handleEditReps} className="clickable-number">
              {editableReps}
            </p>
          )}
        </div>
        {repsError && <Alert message={repsError} type="error" showIcon />}
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
    </div>
  );
};

export default ExerciseRow;
