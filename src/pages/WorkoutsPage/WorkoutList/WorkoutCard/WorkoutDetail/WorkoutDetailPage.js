import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Input, Button, Modal, Typography } from "antd";
import { getAllExercisesWithCache } from "../../../../../services/exerciseDBUtils";
import { applyExerciseFiltersAndLimit } from "../../../../../utils/dataUtils";
import {
  fetchWorkoutDetailsFromFirestore,
  updateWorkoutName,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  deleteWorkout,
} from "../../../../../utils/firestoreUtils";
import SearchBar from "../../../../../components/SearchBar/SearchBar";
import ExerciseList from "../../../../../components/ExerciseList/ExerciseList";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import ExerciseRow from "./ExerciseRow/ExerciseRow";
import { useAuth } from "../../../../../contexts/AuthContext";
import "./WorkoutDetailPage.css";

const { Title } = Typography;

const WorkoutDetailPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { workoutId } = useParams();

  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [workouts] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchWorkoutDetails = useCallback(async () => {
    if (!workoutId) return;
    try {
      const workoutDetails = await fetchWorkoutDetailsFromFirestore(workoutId);
      setCurrentWorkout(workoutDetails);
      setEditedName(workoutDetails.name);
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  }, [workoutId]);

  useEffect(() => {
    const fetchAllExercisesData = async () => {
      try {
        const cachedExercises = await getAllExercisesWithCache(user.uid);
        setAllExercises(cachedExercises);
        setFilteredExercises(
          applyExerciseFiltersAndLimit(cachedExercises, searchQuery)
        );
      } catch (error) {
        console.error("Error fetching all exercises:", error);
      }
    };

    const fetchData = async () => {
      try {
        await fetchWorkoutDetails();
        await fetchAllExercisesData();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workoutId, fetchWorkoutDetails]);

  useEffect(() => {
    const filterDisplayedExercises = () => {
      if (currentWorkout && currentWorkout.exercises) {
        const exercisesNotInWorkout = filterExercisesNotInWorkout(
          allExercises,
          currentWorkout.exercises
        );
        setFilteredExercises(
          applyExerciseFiltersAndLimit(exercisesNotInWorkout, searchQuery)
        );
      }
    };

    filterDisplayedExercises();
  }, [allExercises, currentWorkout, searchQuery]);

  const handleClickName = () => {
    setIsEditingName(true);
  };

  const updateSaveName = async () => {
    if (editedName === currentWorkout.name) return setIsEditingName(false);
    try {
      await updateWorkoutName(workoutId, editedName);
      await fetchWorkoutDetails();
    } catch (error) {
      console.error("Error updating workout name:", error);
    }

    setIsEditingName(false);
    message.success("Workout name changed");
  };

  const handleKeyDown = (e, updateFunction) => {
    if (e.key === "Enter") {
      updateFunction();
    }
  };

  const handleAddExerciseToWorkout = async (exercise) => {
    try {
      if (
        currentWorkout.exercises &&
        currentWorkout.exercises.some((e) => e.id === exercise.id)
      ) {
        console.warn("Exercise is already in the workout.");
        return;
      }

      await addExerciseToWorkout(currentWorkout.id, exercise);

      await fetchWorkoutDetails();
    } catch (error) {
      console.error("Error adding exercise directly:", error);
    }
  };

  const handleRemoveExerciseFromWorkout = async (exerciseToRemove) => {
    try {
      if (
        !currentWorkout.exercises ||
        !currentWorkout.exercises.includes(exerciseToRemove)
      ) {
        console.warn("Exercise is not in the workout.");
        return;
      }

      await removeExerciseFromWorkout(workoutId, exerciseToRemove);

      await fetchWorkoutDetails();
    } catch (error) {
      console.error("Error removing exercise from workout:", error);
    }
  };

  const filterExercisesNotInWorkout = (allExercises, workoutExercises) => {
    const workoutExerciseIds = workoutExercises.map((exercise) => exercise.id);
    return allExercises.filter(
      (exercise) => !workoutExerciseIds.includes(exercise.id)
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDeleteWorkout = async () => {
    setDeleteModalVisible(false);

    try {
      const routineId = await deleteWorkout(workoutId);
      if (routineId) {
        navigate(`/routines/${routineId}`);
      } else {
        navigate("/workouts");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentWorkout) {
    return navigate("/workouts");
  }

  return (
    <div className="workout-details">
      <div className="workout-name">
        {isEditingName ? (
          <Input
            autoFocus
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={updateSaveName}
            onKeyDown={(e) => handleKeyDown(e, updateSaveName)}
            className="workout-name-input"
          />
        ) : (
          <Title className="title" level={1} onClick={handleClickName}>
            {editedName}
          </Title>
        )}
      </div>
      <div className="workout-exercises-container">
        <div className="exercise-row-list">
          <h3>Your Exercises</h3>
          {currentWorkout.exercises.length > 0 ? (
            currentWorkout.exercises.map((exercise) => (
              <ExerciseRow
                key={exercise.id}
                workoutId={workoutId}
                exercise={exercise}
                onRemoveExercise={() =>
                  handleRemoveExerciseFromWorkout(exercise)
                }
                onUpdateExercise={() => fetchWorkoutDetails()}
              />
            ))
          ) : (
            <p>No exercises to show</p>
          )}
        </div>
        <div className="search-exercise-container">
          <SearchBar onSearch={handleSearch} />
          <ExerciseList
            exercises={filteredExercises}
            workoutId={workoutId}
            workouts={workouts}
            isWorkoutDetailPage={true}
            onAddToWorkout={handleAddExerciseToWorkout}
          />
        </div>
      </div>
      <Button
        className="delete-btn"
        onClick={() => setDeleteModalVisible(true)}
        style={{ background: "#ff4d4f", color: "#fff", marginTop: 16 }}
      >
        Delete Workout
      </Button>
      <Modal
        title="Delete Workout"
        open={deleteModalVisible}
        onOk={handleDeleteWorkout}
        onCancel={hideDeleteModal}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this workout?</p>
      </Modal>
    </div>
  );
};

export default WorkoutDetailPage;
