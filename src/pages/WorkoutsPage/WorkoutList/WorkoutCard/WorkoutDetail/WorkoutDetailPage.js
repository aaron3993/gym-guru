import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import SearchBar from '../../../../../components/SearchBar/SearchBar';
import ExerciseList from '../../../../../components/ExerciseList/ExerciseList';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { capitalizeFirstLetter, applyExerciseFiltersAndLimit } from '../../../../../utils/dataUtils';
import './WorkoutDetailPage.css';
import { fetchAllExercises } from '../../../../../utils/apiUtils';
import { addExerciseToWorkout } from '../../../../../utils/firestoreUtils';

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
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

  const handleAddExerciseToWorkout = async (exercise) => {
    try {
      const { id: exerciseId } = exercise;
  
      if (selectedWorkout.exercises && selectedWorkout.exercises.includes(exerciseId)) {
        console.warn('Exercise is already in the workout.');
        return;
      }
  
      await addExerciseToWorkout(workoutId, exercise);
  
      // Update the workout details after adding the exercise
      await fetchWorkoutDetails();
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

      <div className="exercise-row-list">
        {exercises.map((exercise) => (
          <div key={exercise.exerciseId} className="exercise-row">
            <img src={exercise.gifUrl} alt={exercise.name} />
            <div className="card-content">
              <h3>{capitalizeFirstLetter(exercise.name)}</h3>
            </div>
          </div>
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
