import React, { useState } from "react";
import Modal from "react-modal";

const AddExerciseModal = ({
  exercise,
  isOpen,
  onRequestClose,
  onAddToWorkout,
}) => {
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  const handleAddToWorkoutClick = () => {
    if (reps && sets) {
      onAddToWorkout(exercise, reps, sets);
      onRequestClose();
    } else {
      console.error("Reps and sets are required.");
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
        <h3>{exercise.name}</h3>
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
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
