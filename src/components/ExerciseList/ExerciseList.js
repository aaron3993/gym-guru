import React, { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard/ExerciseCard";
import {
  displayCategoryName,
  capitalizeFirstLetter,
} from "../../utils/dataUtils";
import Pagination from "../Pagination/Pagination";
import "./ExerciseList.css";

const ExerciseList = ({
  exercises,
  workouts,
  isWorkoutDetailPage,
  onOpenExerciseModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    setItemsPerPage(3);
    setCurrentPage(1);
  }, [exercises]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exercises.slice(indexOfFirstItem, indexOfLastItem);

  const updatedExercises = currentItems.map((exercise) => {
    const displayedCategory = displayCategoryName(exercise.bodyPart);
    const capitalizedExerciseName = capitalizeFirstLetter(exercise.name);

    return {
      ...exercise,
      updatedCategory:
        displayedCategory !== null ? displayedCategory : exercise.bodyPart,
      updatedName: capitalizedExerciseName,
    };
  });

  return (
    <div className="exercise-list-container">
      <div className="exercise-list">
        {updatedExercises.length > 0 ? (
          updatedExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              workouts={workouts}
              isWorkoutDetailPage={isWorkoutDetailPage}
              onOpenExerciseModal={onOpenExerciseModal}
            />
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
      {updatedExercises.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(exercises.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ExerciseList;
