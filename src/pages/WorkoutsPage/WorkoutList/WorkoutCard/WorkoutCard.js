import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './WorkoutCard.css';

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workouts/${workout.id}`);
  };

  return (
    <div className="workout-card" onClick={handleCardClick}>
      <div className="card-content">
        <h3>{workout.name}</h3>
      </div>
    </div>
    )
  };

export default WorkoutCard;
