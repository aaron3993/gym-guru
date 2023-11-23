import React, { useEffect, useState } from 'react';

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