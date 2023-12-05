// firestoreUtils.js
import { db, collection, getDocs } from 'firebase/firestore';

const getAllWorkouts = async () => {
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

export { getAllWorkouts };
