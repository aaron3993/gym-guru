import React, { useState } from "react";
import { Modal, InputNumber, Button, Alert } from "antd";
import { addExerciseToWorkout } from "../utils/firestoreUtils";
import { capitalizeFirstLetter } from "../utils/dataUtils";
import "./SharedModal.css";

const AddExerciseModal = ({
  currentWorkout,
  exercise,
  isOpen,
  onRequestClose,
  onAddToWorkout,
}) => {
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  const validRepsRange = { min: 1, max: 100 };
  const validSetsRange = { min: 1, max: 20 };

  const handleAddToWorkoutClick = async () => {
    try {
      if (!reps || !sets) {
        return console.error("Reps and sets are required.");
      }

      const parsedReps = parseInt(reps, 10);
      const parsedSets = parseInt(sets, 10);

      if (
        isNaN(parsedReps) ||
        isNaN(parsedSets) ||
        parsedReps < validRepsRange.min ||
        parsedReps > validRepsRange.max ||
        parsedSets < validSetsRange.min ||
        parsedSets > validSetsRange.max
      ) {
        return console.error("Invalid range for reps or sets.");
      }

      const { id: exerciseId } = exercise;

      if (
        currentWorkout.exercises &&
        currentWorkout.exercises.includes(exerciseId)
      ) {
        console.warn("Exercise is already in the workout.");
        return;
      }

      await addExerciseToWorkout(
        currentWorkout.id,
        exercise,
        parsedReps,
        parsedSets
      );

      onAddToWorkout();

      onRequestClose();
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          {capitalizeFirstLetter(exercise.name)}
        </div>
      }
      open={isOpen}
      onCancel={onRequestClose}
      className="modal"
      footer={[
        <Button key="cancel" onClick={onRequestClose}>
          Cancel
        </Button>,
        <Button
          key="addToWorkout"
          type="primary"
          onClick={handleAddToWorkoutClick}
        >
          Add to Workout
        </Button>,
      ]}
    >
      <label className="input-label">Reps: </label>
      <InputNumber
        className="input-field"
        value={reps}
        onChange={(value) => setReps(value)}
        min={validRepsRange.min}
        max={validRepsRange.max}
      />

      <label className="input-label">Sets:</label>
      <InputNumber
        className="input-field"
        value={sets}
        onChange={(value) => setSets(value)}
        min={validSetsRange.min}
        max={validSetsRange.max}
      />

      {reps &&
        (isNaN(parseInt(reps, 10)) ||
          parseInt(reps, 10) < validRepsRange.min ||
          parseInt(reps, 10) > validRepsRange.max) && (
          <Alert
            message="Invalid range for reps. Reps should be between 1 and 100."
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        )}
      {sets &&
        (isNaN(parseInt(sets, 10)) ||
          parseInt(sets, 10) < validSetsRange.min ||
          parseInt(sets, 10) > validSetsRange.max) && (
          <Alert
            message="Invalid range for sets. Sets should be between 1 and 20."
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        )}
    </Modal>
  );
};

export default AddExerciseModal;
