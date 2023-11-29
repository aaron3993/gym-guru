import React, { useState } from 'react';
import Modal from 'react-modal';

const CreateWorkoutModal = ({ isOpen, onRequestClose, onCreateWorkout }) => {
  const [workoutName, setWorkoutName] = useState('');

  const handleCreateWorkout = () => {
    // Call the callback function to create the workout
    onCreateWorkout(workoutName);

    // Close the modal
    onRequestClose();
  };

  const handleCloseModal = () => {
    // Close the modal without submitting
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create Workout Modal">
      <h2>Create New Workout</h2>
      <label>
        Workout Name:
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
      </label>
      <button onClick={handleCreateWorkout}>Create Workout</button>
      <button onClick={handleCloseModal}>Cancel</button>
    </Modal>
  );
};

export default CreateWorkoutModal;