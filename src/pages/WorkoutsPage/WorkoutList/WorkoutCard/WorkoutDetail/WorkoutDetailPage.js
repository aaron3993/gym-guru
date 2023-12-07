import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import SearchBar from '../../../../../components/SearchBar/SearchBar';
import ExerciseList from '../../../../../components/ExerciseList/ExerciseList';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { fetchAllExercises } from '../../../../../utils/apiUtils';
import { applyExerciseFiltersAndLimit } from '../../../../../utils/dataUtils';
import './WorkoutDetailPage.css';

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchWorkoutDetails();
        await fetchAllWorkouts();
        await fetchAllExercisesData();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workoutId]);

  const fetchWorkoutDetails = async () => {
    try {
      const workoutDoc = doc(db, 'workouts', workoutId);
      const workoutSnapshot = await getDoc(workoutDoc);

      if (workoutSnapshot.exists()) {
        setSelectedWorkout({ id: workoutSnapshot.id, ...workoutSnapshot.data() });
      } else {
        console.error('Workout not found');
      }
    } catch (error) {
      console.error('Error fetching workout details:', error);
    }
  };

  const fetchAllWorkouts = async () => {
    try {
      const allWorkoutsSnapshot = await getDocs(collection(db, 'workouts'));
      const allWorkoutsData = allWorkoutsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWorkouts(allWorkoutsData);
    } catch (error) {
      console.error('Error fetching all workouts:', error);
    }
  };

  const fetchAllExercisesData = async () => {
    try {
      const response = await fetch('/data/exercises.json');
      const exercises = await response.json();
      // const exercises = await fetchAllExercises();
      setAllExercises(exercises);
      setFilteredExercises(applyExerciseFiltersAndLimit(exercises, searchQuery));
    } catch (error) {
      console.error('Error fetching all exercises:', error);
    }
  };

  const handleQuickAddExercise = async (selectedExercise) => {
    console.log('hi')
    try {
      
      if (selectedWorkout.exercises.includes(selectedExercise.id)) {
        console.log('Exercise is already in the workout');
        alert('This exercise is already in the workout');
        return
      }

      const updatedExercises = [...selectedWorkout.exercises, selectedExercise.id];

      await updateDoc(doc(db, 'workouts', workoutId), { exercises: updatedExercises });
      // Update the state with the new exercises
      setSelectedWorkout((prevWorkout) => ({ ...prevWorkout, exercises: updatedExercises }));

      // Optionally, you can also update the state of all exercises and filtered exercises
      setAllExercises((prevExercises) => {
        const updatedExercises = prevExercises.map((exercise) =>
          exercise.id === selectedExercise.id
            ? { ...exercise, addedToWorkout: true } // Optional: Add a flag to indicate it's added to the workout
            : exercise
        );
        return updatedExercises;
      });

      setFilteredExercises(applyExerciseFiltersAndLimit(updatedExercises, searchQuery));
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredExercises(applyExerciseFiltersAndLimit(allExercises, query));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const { name, exercises } = selectedWorkout;

  return (
    <div className="workout-details">
      <h1>Workout: {name}</h1>

      <h2>Exercises:</h2>
      <ul>
        {exercises &&
          exercises.map((exerciseId) => (
            <li key={exerciseId}>Exercise ID: {exerciseId}</li>
          ))}
      </ul>

      <SearchBar onSearch={handleSearch} />
      <ExerciseList
        exercises={filteredExercises}
        workoutId={workoutId}
        workouts={workouts}
        isWorkoutDetailPage={true}
        handleQuickAddExercise={handleQuickAddExercise}
      />
    </div>
  );
};

export default WorkoutDetailPage;
