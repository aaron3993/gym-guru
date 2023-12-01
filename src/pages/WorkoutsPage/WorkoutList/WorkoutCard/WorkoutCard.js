import React from 'react';
import './WorkoutCard.css';

const WorkoutCard = ({ workout, onClick }) => (
  <div className="workout-card" onClick={onClick}>
    <div className="card-content">
      <h3>{workout.name}</h3>
    </div>
  </div>
);

export default WorkoutCard;
