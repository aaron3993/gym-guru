import React, { useState } from "react";
import Modal from "react-modal";
import { Alert } from "antd";
import { addExerciseToWorkout } from "../utils/firestoreUtils";
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

      // Convert values to integers
      const parsedReps = parseInt(reps);
      const parsedSets = parseInt(sets);

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
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="ReactModal__Overlay"
      contentLabel="Create Exercise Modal"
      shouldCloseOnOverlayClick={true}
    >
      <div>
        <h1>{exercise.name}</h1>
        <label>
          Reps:
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min={validRepsRange.min}
            max={validRepsRange.max}
          />
        </label>
        <label>
          Sets:
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min={validSetsRange.min}
            max={validSetsRange.max}
          />
        </label>
        {reps &&
          (isNaN(parseInt(reps)) ||
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
          (isNaN(parseInt(sets)) ||
            parseInt(sets, 10) < validSetsRange.min ||
            parseInt(sets, 10) > validSetsRange.max) && (
            <Alert
              message="Invalid range for sets. Sets should be between 1 and 20."
              type="error"
              showIcon
              style={{ marginBottom: 10 }}
            />
          )}
        <button onClick={handleAddToWorkoutClick}>Add to Workout</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
