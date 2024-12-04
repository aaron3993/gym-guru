import React, { useState } from "react";
import { InputNumber, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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

  const validRepsRange = { min: 1, max: 100 };
  const validSetsRange = { min: 1, max: 20 };

  const handleEditReps = () => {
    setIsEditingReps(true);
  };

  const handleEditSets = () => {
    setIsEditingSets(true);
  };

  const handleUpdateReps = async () => {
    const parsedReps = parseInt(editableReps, 10);
    if (isNaN(parsedReps)) {
      return console.error("Invalid range for reps or sets.");
    }
    setIsEditingReps(false);
    if (parsedReps !== exercise.reps) {
      await updateExerciseInWorkout(
        workoutId,
        exercise.id,
        editableReps,
        exercise.sets
      );
      await onUpdateExercise();
      message.success("Reps updated successfully!");
    }
  };

  const handleUpdateSets = async () => {
    const parsedSets = parseInt(editableSets, 10);
    if (isNaN(parsedSets)) {
      return console.error("Invalid range for reps or sets.");
    }
    setIsEditingSets(false);
    if (editableSets !== exercise.sets) {
      await updateExerciseInWorkout(
        workoutId,
        exercise.id,
        exercise.reps,
        editableSets
      );
      await onUpdateExercise();
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
        <h4>{exercise.updatedName}</h4>
      </div>
      <div className="exercise-actions">
        <div className="exercise-sets-and-reps">
          <div className="editable-number">
            <h4>Sets</h4>
            {isEditingSets ? (
              <InputNumber
                autoFocus
                value={editableSets}
                onChange={(value) => setEditableSets(value)}
                onBlur={handleUpdateSets}
                onKeyDown={(e) => handleKeyDown(e, handleUpdateSets)}
                min={validSetsRange.min}
                max={validSetsRange.max}
              />
            ) : (
              <p onClick={handleEditSets} className="clickable-number">
                {editableSets}
              </p>
            )}
          </div>
          <div className="editable-number">
            <h4>Reps</h4>
            {isEditingReps ? (
              <InputNumber
                autoFocus
                value={editableReps}
                onChange={(value) => setEditableReps(value)}
                onBlur={handleUpdateReps}
                onKeyDown={(e) => handleKeyDown(e, handleUpdateReps)}
                min={validRepsRange.min}
                max={validRepsRange.max}
              />
            ) : (
              <p onClick={handleEditReps} className="clickable-number">
                {editableReps}
              </p>
            )}
          </div>
        </div>
        <Button
          className="remove-exercise-icon"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveExercise()}
        />
      </div>
    </div>
  );
};

export default ExerciseRow;
