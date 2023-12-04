import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkoutById = async () => {
      try {
        const workoutDoc = doc(db, 'workouts', workoutId);
        const workoutSnapshot = await getDoc(workoutDoc);

        if (workoutSnapshot.exists()) {
          setSelectedWorkout({ id: workoutSnapshot.id, ...workoutSnapshot.data() });
        } else {
          console.error('Workout not found');
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    };

    fetchWorkoutById();
  }, [workoutId]);

  if (!selectedWorkout) {
    return <LoadingSpinner />
  }

  const { name } = selectedWorkout;

  return (
    <div>
      <h1>Workout Details</h1>
      <p>Workout Name: {name}</p>
    </div>
  );
};

export default WorkoutDetailPage;
