import React, { useState } from "react";
import { Input, InputNumber, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./ExerciseRow.css";
import { updateExerciseInWorkout } from "../../../../../../utils/firestoreUtils";
import { capitalizeFirstLetter } from "../../../../../../utils/dataUtils";

const ExerciseRow = ({
  workoutId,
  exercise,
  onRemoveExercise,
  onUpdateExercise,
}) => {
  const [editableReps, setEditableReps] = useState(exercise.reps || "");
  const [editableSets, setEditableSets] = useState(exercise.sets || "");
  const [isEditingReps, setIsEditingReps] = useState(false);
  const [isEditingSets, setIsEditingSets] = useState(false);

  const validSetsRange = { min: 1, max: 20 };

  const handleEditReps = () => {
    setIsEditingReps(true);
  };

  const handleEditSets = () => {
    setIsEditingSets(true);
  };

  const handleUpdateReps = async () => {
    if (editableReps.length > 15) {
      return console.error("Reps input exceeds 15 characters.");
    }
    setIsEditingReps(false);
    if (editableReps !== exercise.reps) {
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
      return console.error("Invalid value for sets.");
    }
    setIsEditingSets(false);
    if (parsedSets !== exercise.sets) {
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
        <h4>{capitalizeFirstLetter(exercise.name)}</h4>
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
                {editableSets || "Enter sets"}
              </p>
            )}
          </div>
          <div className="editable-number">
            <h4>Reps</h4>
            {isEditingReps ? (
              <Input
                autoFocus
                value={editableReps}
                onChange={(e) => setEditableReps(e.target.value)}
                onBlur={handleUpdateReps}
                onKeyDown={(e) => handleKeyDown(e, handleUpdateReps)}
                maxLength={15}
                placeholder="Enter reps"
              />
            ) : (
              <p onClick={handleEditReps} className="clickable-number">
                {editableReps || "Enter reps"}
              </p>
            )}
          </div>
        </div>
        <Button
          className="remove-exercise-icon"
          type="text"
          danger
          icon={<DeleteOutlined style={{ fontSize: "20px" }} />}
          onClick={() => onRemoveExercise()}
        />
      </div>
    </div>
  );
};

export default ExerciseRow;
