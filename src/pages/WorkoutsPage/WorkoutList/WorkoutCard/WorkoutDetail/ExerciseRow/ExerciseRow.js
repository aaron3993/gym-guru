import React, { useState } from "react";
import { InputNumber } from "antd";
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

  const handleEditReps = () => {
    setIsEditingReps(true);
  };

  const handleEditSets = () => {
    setIsEditingSets(true);
  };

  const handleUpdateReps = () => {
    updateExerciseInWorkout(
      workoutId,
      exercise.id,
      editableReps,
      exercise.sets
    );
    setIsEditingReps(false);
  };

  const handleUpdateSets = () => {
    updateExerciseInWorkout(
      workoutId,
      exercise.id,
      exercise.reps,
      editableSets
    );
    setIsEditingSets(false);
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
      </div>
      <button onClick={() => onRemoveExercise(exercise)}>Remove</button>
    </div>
  );
};

export default ExerciseRow;
