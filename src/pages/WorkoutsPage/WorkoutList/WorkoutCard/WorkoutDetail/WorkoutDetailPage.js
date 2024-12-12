import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { message, Input, Button, Modal } from "antd";
import { db } from "../../../../../firebase";
import { fetchAllExercises } from "../../../../../services/exerciseDBUtils";
import { applyExerciseFiltersAndLimit } from "../../../../../utils/dataUtils";
import {
  updateWorkoutName,
  removeExerciseFromWorkout,
  deleteWorkout,
} from "../../../../../utils/firestoreUtils";
import SearchBar from "../../../../../components/SearchBar/SearchBar";
import ExerciseList from "../../../../../components/ExerciseList/ExerciseList";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import ExerciseRow from "./ExerciseRow/ExerciseRow";
import AddExerciseModal from "../../../../../components/AddExerciseModal";
import "./WorkoutDetailPage.css";

const WorkoutDetailPage = () => {
  const navigate = useNavigate();

  const { workoutId } = useParams();

  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
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
  }, [workoutId]);

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

  const fetchWorkoutDetails = async () => {
    try {
      const workoutDoc = doc(db, "workouts", workoutId);
      const workoutSnapshot = await getDoc(workoutDoc);

      if (workoutSnapshot.exists()) {
        setCurrentWorkout({
          id: workoutSnapshot.id,
          ...workoutSnapshot.data(),
        });
        setEditedName(workoutSnapshot.data().name);
      } else {
        console.error("Workout not found");
      }
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  };

  const fetchAllExercisesData = async () => {
    try {
      const cachedExercises = localStorage.getItem("allExercises");
      if (cachedExercises) {
        setAllExercises(JSON.parse(cachedExercises));
      } else {
        const exercises = await fetchAllExercises();

        localStorage.setItem("allExercises", JSON.stringify(exercises));

        setAllExercises(exercises);
      }

      setFilteredExercises(
        applyExerciseFiltersAndLimit(allExercises, searchQuery)
      );
    } catch (error) {
      console.error("Error fetching all exercises:", error);
    }
  };

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

  const openExerciseModal = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const closeExerciseModal = () => {
    setSelectedExercise(null);
    setExerciseModalOpen(false);
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
      await deleteWorkout(workoutId);
      navigate("/workouts");
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
          <h1 onClick={handleClickName}>{editedName}</h1>
        )}
      </div>
      <div className="workout-exercises-container">
        <div className="exercise-row-list">
          <h3>Your Exercises</h3>
          {currentWorkout.exercises.length > 0 &&
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
            ))}
        </div>
        <div className="search-exercise-container">
          <SearchBar onSearch={handleSearch} />
          <ExerciseList
            exercises={filteredExercises}
            workoutId={workoutId}
            workouts={workouts}
            isWorkoutDetailPage={true}
            onOpenExerciseModal={openExerciseModal}
            onAddToWorkout={() => fetchWorkoutDetails()}
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
      {selectedExercise && (
        <AddExerciseModal
          currentWorkout={currentWorkout}
          exercise={selectedExercise}
          isOpen={exerciseModalOpen}
          onRequestClose={closeExerciseModal}
          onAddToWorkout={() => fetchWorkoutDetails()}
        />
      )}
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
