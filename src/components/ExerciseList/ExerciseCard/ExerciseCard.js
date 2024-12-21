import React from "react";
import "./ExerciseCard.css";
import { capitalizeFirstLetter } from "../../../utils/dataUtils";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ExerciseCard = ({ exercise, onAddToWorkout }) => {
  return (
    <div className="exercise-card">
      <img src={exercise.gifUrl} alt={exercise.name} />
      <div className="card-content">
        <h3>{capitalizeFirstLetter(exercise.name)}</h3>
        <p>{exercise.updatedCategory}</p>
      </div>
      <Button
        className="add-to-workout-button"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => onAddToWorkout(exercise)}
      />
    </div>
  );
};

export default ExerciseCard;
