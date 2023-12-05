// firestoreUtils.js
import { arrayUnion, doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllWorkouts = async () => {
  try {
    const workoutsCollection = collection(db, 'workouts');
    const workoutsSnapshot = await getDocs(workoutsCollection);

    const workouts = workoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return workouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

export const addExerciseToWorkout = async (workoutId, exerciseId) => {
  const workoutRef = doc(db, 'workouts', workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayUnion(exerciseId),
  });
};