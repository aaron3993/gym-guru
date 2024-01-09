import React from "react";
import "./ExerciseCard.css";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ExerciseCard = ({ exercise, onOpenExerciseModal }) => {
  return (
    <div className="exercise-card">
      <img src={exercise.gifUrl} alt={exercise.name} />
      <div className="card-content">
        <h3>{exercise.updatedName}</h3>
        <p>{exercise.updatedCategory}</p>
      </div>
      <Button
        className="add-to-workout-button"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => onOpenExerciseModal(exercise)}
      ></Button>
    </div>
  );
};

export default ExerciseCard;
