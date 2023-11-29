import React, { useState } from 'react';
import CreateWorkoutModal from '../../components/CreateWorkoutModal/CreateWorkoutModal';

const WorkoutsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateWorkout = (workoutName) => {
    // Add logic to create the workout in your database
    console.log(`Creating workout: ${workoutName}`);
  };

  return (
    <div>
      <h1>Your Workouts</h1>
      <button onClick={handleOpenModal}>Create Workout</button>

      <CreateWorkoutModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onCreateWorkout={handleCreateWorkout}
      />
    </div>
  );
};

export default WorkoutsPage;