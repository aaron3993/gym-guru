import React from "react";
import WorkoutDropdown from "../../WorkoutDropdown";
import "./ExerciseCard.css";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ExerciseCard = ({
  exercise,
  workouts,
  isWorkoutDetailPage,
  onOpenExerciseModal,
}) => {
  return (
    <div className="exercise-card">
      <img src={exercise.gifUrl} alt={exercise.name} />
      <div className="card-content">
        <h3>{exercise.updatedName}</h3>
        <p>{exercise.updatedCategory}</p>
      </div>
      {isWorkoutDetailPage ? (
        <Button
          className="add-to-workout-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => onOpenExerciseModal(exercise)}
        ></Button>
      ) : (
        <WorkoutDropdown workouts={workouts} />
      )}
    </div>
  );
};

export default ExerciseCard;
