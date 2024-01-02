import {
  arrayUnion,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";

export const registerUser = async (name, email, password) => {
  try {
    if (!name || !email || !password) {
      throw new Error("Please fill in all required fields.");
    }

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      email: user.email,
    });

    return { user };
  } catch (error) {
    return { error };
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createWorkout = async (workoutName, user) => {
  try {
    if (!user) {
      console.error("User not available.");
      return null;
    }

    const docRef = await addDoc(collection(db, "workouts"), {
      name: workoutName,
      exercises: [],
      userId: user.uid,
    });

    const userWorkoutsDocRef = doc(db, "userWorkouts", user.uid);
    await setDoc(
      userWorkoutsDocRef,
      {
        [docRef.id]: {
          workoutId: docRef.id,
        },
      },
      { merge: true }
    );

    return {
      id: docRef.id,
      name: workoutName,
      exercises: [],
    };
  } catch (error) {
    console.error("Error creating workout in Firestore:", error);
    throw error;
  }
};

export const checkIfWorkoutExists = async (workoutName, userId) => {
  try {
    const workoutsQuery = query(
      collection(db, "workouts"),
      where("userId", "==", userId),
      where("name", "==", workoutName)
    );

    const workoutsSnapshot = await getDocs(workoutsQuery);

    if (workoutsSnapshot.docs.length > 0) {
      return workoutsSnapshot.docs[0].data();
    }

    return null;
  } catch (error) {
    console.error("Error checking if workout exists in Firestore:", error);
    throw error;
  }
};

export const getAllWorkoutsForUser = async (user) => {
  try {
    if (!user) {
      console.error("User not available.");
      return null;
    }

    const workoutsQuery = query(
      collection(db, "workouts"),
      where("userId", "==", user.uid)
    );

    const workoutsSnapshot = await getDocs(workoutsQuery);

    const workouts = workoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return workouts;
  } catch (error) {
    console.error("Error fetching workouts from Firestore:", error);
    throw error;
  }
};

export const getAllWorkouts = async () => {
  try {
    const workoutsCollection = collection(db, "workouts");
    const workoutsSnapshot = await getDocs(workoutsCollection);

    const workouts = workoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return workouts;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
};

export const addExerciseToWorkout = async (workoutId, exercise, reps, sets) => {
  const workoutRef = doc(db, "workouts", workoutId);

  const exerciseObj = { ...exercise, reps, sets };

  await updateDoc(workoutRef, {
    exercises: arrayUnion(exerciseObj),
  });
};

export const updateExerciseInWorkout = async (
  workoutId,
  exerciseId,
  newReps,
  newSets
) => {
  try {
    console.log(workoutId, exerciseId, newReps, newSets);
    const workoutRef = doc(db, "workouts", workoutId);
    const workoutDoc = await getDoc(workoutRef);

    if (workoutDoc.exists()) {
      const currentExercises = workoutDoc.data().exercises || [];
      const updatedExercises = currentExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, reps: newReps, sets: newSets };
        }
        return exercise;
      });

      await updateDoc(workoutRef, { exercises: updatedExercises });
    } else {
      console.error("Workout not found");
    }
  } catch (error) {
    console.error("Error editing workout exercise:", error);
  }
};

export const removeExerciseFromWorkout = async (workoutId, exercise) => {
  const workoutRef = doc(db, "workouts", workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayRemove(exercise),
  });
};
