import React, { useState } from "react";
import Modal from "react-modal";
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

  const handleAddToWorkoutClick = async () => {
    try {
      if (!reps || !sets) {
        return console.error("Reps and sets are required.");
      }

      const { id: exerciseId } = exercise;

      if (
        currentWorkout.exercises &&
        currentWorkout.exercises.includes(exerciseId)
      ) {
        console.warn("Exercise is already in the workout.");
        return;
      }

      await addExerciseToWorkout(currentWorkout.id, exercise, reps, sets);

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
          />
        </label>
        <label>
          Sets:
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </label>
        <button onClick={handleAddToWorkoutClick}>Add to Workout</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
