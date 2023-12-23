import React, { useState, useEffect } from "react";
import CreateWorkoutModal from "../../components/CreateWorkoutModal";
import WorkoutList from "./WorkoutList/WorkoutList";
import {
  createWorkout,
  getAllWorkoutsForUser,
} from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import "./WorkoutsPage.css";

const WorkoutsPage = () => {
  const { user } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (user) {
          const fetchedWorkouts = await getAllWorkoutsForUser(user);
          setWorkouts(fetchedWorkouts);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [user]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateWorkout = async (workoutName) => {
    try {
      const newWorkout = await createWorkout(workoutName, user);
      setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    } catch (error) {
      console.error("Error creating workout:", error);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="workouts-container">
      <h1>Your Workouts</h1>
      <button onClick={handleOpenModal}>Create Workout</button>
      <WorkoutList workouts={workouts} />
      <CreateWorkoutModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onCreateWorkout={handleCreateWorkout}
      />
    </div>
  );
};

export default WorkoutsPage;
