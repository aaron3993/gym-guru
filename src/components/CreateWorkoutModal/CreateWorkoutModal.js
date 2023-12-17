import React, { useState } from "react";
import Modal from "react-modal";
import "./CreateWorkoutModal.css";

const CreateWorkoutModal = ({ isOpen, onRequestClose, onCreateWorkout }) => {
  const [workoutName, setWorkoutName] = useState("");

  const handleCreateWorkout = () => {
    onCreateWorkout(workoutName);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="ReactModal__Overlay"
      contentLabel="Create Workout Modal"
      shouldCloseOnOverlayClick={true}
    >
      <h1>Create a New Workout</h1>
      <input
        type="text"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        placeholder="Workout Name"
      />
      <button onClick={handleCreateWorkout}>Create</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default CreateWorkoutModal;
