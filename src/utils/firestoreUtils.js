import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (firstName, lastName, email, password) => {
  try {
    if (!firstName || !lastName || !email || !password) {
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

    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, error };
  }
};

export const createWorkout = async (workoutName, user) => {
  try {
    if (!user) {
      console.error("User not available.");
      return null;
    }

    const currentTimeStamp = serverTimestamp();

    const docRef = await addDoc(collection(db, "workouts"), {
      name: workoutName,
      exercises: [],
      userId: user.uid,
      createdAt: currentTimeStamp,
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
      createdAt: currentTimeStamp,
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
      where("userId", "==", user.uid),
      orderBy("createdAt", "asc")
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

export const updateWorkoutName = async (workoutId, newName) => {
  try {
    const workoutDoc = doc(db, "workouts", workoutId);
    await updateDoc(workoutDoc, { name: newName });
  } catch (error) {
    console.error("Error updating workout name:", error);
    throw error;
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

export const deleteWorkout = async (workoutId) => {
  try {
    const workoutDoc = doc(db, "workouts", workoutId);
    await deleteDoc(workoutDoc);
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error;
  }
};

export const fetchUserData = async (uid) => {
  const userRef = doc(db, "users", uid);
  try {
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.error("User data not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, profileData) => {
  const userRef = doc(db, "users", uid);
  try {
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      await updateDoc(userRef, profileData);
    } else {
      await setDoc(userRef, profileData);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const addUserWorkoutInfo = async (uid, workoutInfo) => {
  if (!uid) throw new Error("User ID is required");

  const userRef = doc(db, "users", uid);
  console.log(userRef);
  try {
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      await updateDoc(userRef, workoutInfo);
    } else {
      await setDoc(userRef, workoutInfo);
    }
  } catch (error) {
    console.error("Error adding workout info to Firestore:", error);
    throw error;
  }
};
