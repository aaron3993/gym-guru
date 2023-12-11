import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import SearchBar from '../../../../../components/SearchBar/SearchBar';
import ExerciseList from '../../../../../components/ExerciseList/ExerciseList';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { capitalizeFirstLetter, applyExerciseFiltersAndLimit } from '../../../../../utils/dataUtils';
import './WorkoutDetailPage.css';
import { fetchAllExercises } from '../../../../../utils/apiUtils';
import { addExerciseToWorkout } from '../../../../../utils/firestoreUtils';
import ExerciseRow from './ExerciseRow/ExerciseRow';

const WorkoutDetailPage = () => {
  const navigate = useNavigate();
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

      await fetchWorkoutDetails();
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
  };

  const removeExerciseFromWorkout = async (exercise) => {
    try {
      if (!selectedWorkout.exercises || !selectedWorkout.exercises.includes(exercise)) {
        console.warn('Exercise is not in the workout.');
        return;
      }
  
      await removeExerciseFromWorkout(workoutId, exercise);

      await fetchWorkoutDetails();
    } catch (error) {
      console.error('Error removing exercise from workout:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredExercises(applyExerciseFiltersAndLimit(allExercises, query));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!selectedWorkout) {
    return navigate("/workouts")
  }

  const { name, exercises } = selectedWorkout;

  return (
    <div className="workout-details">
      <h1>Workout: {name}</h1>

      <div className="exercise-row-list">
        {exercises.length > 0 && exercises.map((exercise) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            onRemoveExercise={removeExerciseFromWorkout}
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
