import { addDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
export const displayCategoryName = (categoryFromAPI) => {
  const excludedCategories = ['neck'];

  if (excludedCategories.includes(categoryFromAPI)) {
    return null;
  }

  const categoryMapping = {
    waist: 'Abs',
    'lower legs': 'Legs',
    'upper legs': 'Legs',
    'lower arms': 'Arms',
    'upper arms': 'Arms',
    back: 'Back',
    chest: 'Chest',
    shoulders: 'Shoulders',
    cardio: 'Cardio',
  };

  return categoryMapping[categoryFromAPI] || categoryFromAPI;
};

export const capitalizeFirstLetter = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const addExerciseToWorkout = async (workoutId, exerciseId) => {
  const workoutRef = doc(db, 'workouts', workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayUnion(exerciseId),
  });
};
