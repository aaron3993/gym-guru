import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { applyExerciseFiltersAndLimit } from "../../../../../utils/dataUtils";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "../../../../../utils/firestoreUtils";
import SearchBar from "../../../../../components/SearchBar/SearchBar";
import ExerciseList from "../../../../../components/ExerciseList/ExerciseList";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import ExerciseRow from "./ExerciseRow/ExerciseRow";
import "./WorkoutDetailPage.css";

const WorkoutDetailPage = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);

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
      if (selectedWorkout && selectedWorkout.exercises) {
        const exercisesNotInWorkout = filterExercisesNotInWorkout(
          allExercises,
          selectedWorkout.exercises
        );

        setFilteredExercises(
          applyExerciseFiltersAndLimit(exercisesNotInWorkout, searchQuery)
        );
      }
    };

    filterDisplayedExercises();
  }, [allExercises, selectedWorkout, searchQuery]);

  const fetchWorkoutDetails = async () => {
    try {
      const workoutDoc = doc(db, "workouts", workoutId);
      const workoutSnapshot = await getDoc(workoutDoc);

      if (workoutSnapshot.exists()) {
        setSelectedWorkout({
          id: workoutSnapshot.id,
          ...workoutSnapshot.data(),
        });
      } else {
        console.error("Workout not found");
      }
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  };

  const fetchAllExercisesData = async () => {
    try {
      const response = await fetch("/data/exercises.json");
      const exercises = await response.json();
      // const exercises = await fetchAllExercises();
      setAllExercises(exercises);
      setFilteredExercises(
        applyExerciseFiltersAndLimit(exercises, searchQuery)
      );
    } catch (error) {
      console.error("Error fetching all exercises:", error);
    }
  };

  const handleAddExerciseToWorkout = async (exercise) => {
    try {
      const { id: exerciseId } = exercise;

      if (
        selectedWorkout.exercises &&
        selectedWorkout.exercises.includes(exerciseId)
      ) {
        console.warn("Exercise is already in the workout.");
        return;
      }

      await addExerciseToWorkout(workoutId, exercise);

      await fetchWorkoutDetails();
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
    }
  };

  const handleRemoveExerciseFromWorkout = async (exerciseToRemove) => {
    try {
      if (
        !selectedWorkout.exercises ||
        !selectedWorkout.exercises.includes(exerciseToRemove)
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!selectedWorkout) {
    return navigate("/workouts");
  }

  return (
    <div className="workout-details">
      <h1>Workout: {selectedWorkout.name}</h1>

      <div className="exercise-row-list">
        {selectedWorkout.exercises.length > 0 &&
          selectedWorkout.exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              onRemoveExercise={() => handleRemoveExerciseFromWorkout(exercise)}
            />
          ))}
      </div>

      <SearchBar onSearch={handleSearch} />
      <ExerciseList
        exercises={filteredExercises}
        workoutId={workoutId}
        workouts={workouts}
        isWorkoutDetailPage={true}
        onAddToWorkout={handleAddExerciseToWorkout}
      />
    </div>
  );
};

export default WorkoutDetailPage;
