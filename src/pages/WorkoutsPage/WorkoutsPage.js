import React, { useState, useEffect, useCallback } from "react";
import { Button, message, Form, Typography } from "antd";
import CreateWorkoutModal from "../../components/CreateWorkoutModal";
import WorkoutList from "./WorkoutList/WorkoutList";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllCustomWorkoutsForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import "./WorkoutsPage.css";

const { Title } = Typography;

const WorkoutsPage = () => {
  const { user } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchWorkouts = useCallback(async () => {
    if (!user) return;
    try {
      const fetchedWorkouts = await getAllCustomWorkoutsForUser(user);
      setWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user, fetchWorkouts]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
    form.resetFields();
  };

  const handleCreateWorkout = async (workoutName) => {
    message.success("Workout created successfully!");
    await fetchWorkouts();
  };

  return (
    <div className="workouts-page">
      <div className="header">
        <Title level={4}>Create and manage your workouts effortlessly.</Title>
      </div>

      <div className="content">
        <Button
          type="primary"
          className="create-workout-button"
          onClick={handleOpenModal}
        >
          Create Workout
        </Button>
        <Title level={4}>My Workouts</Title>
        {loading ? (
          <LoadingSpinner />
        ) : workouts.length > 0 ? (
          <WorkoutList workouts={workouts} />
        ) : (
          <p>No workouts found. Start creating one!</p>
        )}
      </div>

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
