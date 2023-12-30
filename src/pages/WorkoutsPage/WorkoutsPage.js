import React, { useState, useEffect } from "react";
import { message, Form } from "antd";
import CreateWorkoutModal from "../../components/CreateWorkoutModal";
import WorkoutList from "./WorkoutList/WorkoutList";
import { getAllWorkoutsForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import "./WorkoutsPage.css";

const WorkoutsPage = () => {
  const { user } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

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
    setError("");
    form.resetFields();
  };

  const handleCreateWorkout = (workoutName) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, { name: workoutName }]);
    message.success("Workout created successfully!");
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
        error={error}
        setError={setError}
        form={form}
      />
    </div>
  );
};

export default WorkoutsPage;
