import React, { useEffect, useState } from 'react';
import wgerApi from '../../api/wgerApi';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h1>Workouts</h1>
    </div>
  );
};

export default WorkoutList;