// WorkoutDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();

  // Fetch the workout details based on workoutId

  return (
    <div>
      <h1>Workout Details</h1>
      <p>Workout ID: {workoutId}</p>
      {/* Display other workout details */}
    </div>
  );
};

export default WorkoutDetailPage;
