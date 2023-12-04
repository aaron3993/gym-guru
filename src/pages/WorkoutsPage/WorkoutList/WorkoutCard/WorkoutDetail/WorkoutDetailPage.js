// WorkoutDetailPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
// import { db } from '../../../../../firebase';
// import LoadingSpinner from '../../../../../components/LoadingSpinner';
// import './WorkoutDetailPage.css';

// WorkoutDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import SearchBar from '../../../../../components/SearchBar/SearchBar';
import ExerciseList from '../../../../../components/ExerciseList/ExerciseList';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { fetchAllExercises } from '../../../../../utils/apiUtils';
import './WorkoutDetailPage.css';

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutById();
    fetchAllExercisesData();
  }, [workoutId]);

  const fetchAllExercisesData = async () => {
    const exercises = await fetchAllExercises();
    setAllExercises(exercises);
    setFilteredExercises(exercises.slice(0, 8)); // Initial display, you can customize this
  };

  const fetchWorkoutById = async () => {
    try {
      const workoutDoc = doc(db, 'workouts', workoutId);
      const workoutSnapshot = await getDoc(workoutDoc);

      if (workoutSnapshot.exists()) {
        setSelectedWorkout({ id: workoutSnapshot.id, ...workoutSnapshot.data() });
      } else {
        console.error('Workout not found');
      }

      const allExercisesSnapshot = await getDocs(collection(db, 'exercises'));
      const allExercises = allExercisesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFilteredExercises(applyFiltersAndLimit(allExercises, searchQuery));
    } catch (error) {
      console.error('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndLimit = (exercises, query) => {
    const filteredExercises = exercises.filter((exercise) => {
      const lowerCaseQuery = query.toLowerCase();

      return (
        exercise.name.toLowerCase().includes(lowerCaseQuery) ||
        exercise.target.toLowerCase().includes(lowerCaseQuery) ||
        exercise.equipment.toLowerCase().includes(lowerCaseQuery) ||
        exercise.bodyPart.toLowerCase().includes(lowerCaseQuery)
      );
    });

    return filteredExercises.slice(0, 8);
  };

  const handleQuickAddExercise = async () => {
    try {
      if (newExerciseName.trim() === '') {
        return;
      }

      const exerciseRef = await addDoc(collection(db, 'exercises'), { name: newExerciseName });

      // Update the workout to include the new exercise
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: [...(selectedWorkout.exercises || []), exerciseRef.id],
      };

      await doc(db, 'workouts', workoutId).set(updatedWorkout);

      setSelectedWorkout(updatedWorkout);

      setFilteredExercises(applyFiltersAndLimit(filteredExercises, searchQuery));

      setNewExerciseName('');
    } catch (error) {
      console.error('Error creating exercise:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    setFilteredExercises(applyFiltersAndLimit(filteredExercises, query));
    console.log(applyFiltersAndLimit(filteredExercises, query))
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const { name, exercises } = selectedWorkout;

  return (
    <div className="workout-details">
      <h1>Workout Details</h1>
      <p>Workout Name: {name}</p>

      <h2>Exercises:</h2>
      <ul>
        {exercises &&
          exercises.map((exerciseId) => (
            <li key={exerciseId}>Exercise ID: {exerciseId}</li>
          ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Enter exercise name"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
        />
        <button onClick={handleQuickAddExercise}>Quick Add Exercise</button>
      </div>

      <SearchBar onSearch={handleSearch} />
      <ExerciseList
        exercises={filteredExercises}
        onItemClick={(exercise) => console.log(exercise)}
      />
    </div>
  );
};

export default WorkoutDetailPage;
