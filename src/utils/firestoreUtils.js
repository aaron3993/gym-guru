import { arrayUnion, doc, addDoc, updateDoc, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const createWorkout = async (workoutName) => {
  try {
    const docRef = await addDoc(collection(db, 'workouts'), { name: workoutName, exercises: [] });

    return {
      id: docRef.id,
      name: workoutName,
      exercises: [],
    };
  } catch (error) {
    console.error('Error creating workout in Firestore:', error);
    throw error;
  }
};

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

export const addExerciseToWorkout = async (workoutId, exercise) => {
  const workoutRef = doc(db, 'workouts', workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayUnion(exercise),
  });
};

export const removeExerciseFromWorkout = async (workoutId, exercise) => {
  const workoutRef = doc(db, 'workouts', workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayRemove(exercise),
  });
};
