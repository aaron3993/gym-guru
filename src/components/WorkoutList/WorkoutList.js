import React, { useEffect, useState } from 'react';
import wgerApi from '../../api/wgerApi';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await wgerApi.get('/workout/');
        console.log(response.data.results)
        setWorkouts(response.data.results);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {workouts.map(workout => (
            <li key={workout.id}>{workout.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutList;