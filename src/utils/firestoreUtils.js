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
  writeBatch,
  onSnapshot,
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
      routineId: null,
      createdAt: currentTimeStamp,
    });

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

export const getAllCustomWorkoutsForUser = async (user) => {
  try {
    if (!user) {
      console.error("User not available.");
      return null;
    }

    const workoutsQuery = query(
      collection(db, "workouts"),
      where("userId", "==", user.uid),
      where("routineId", "==", null),
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

export const fetchWorkoutsByRoutineId = async (routineId) => {
  try {
    const workoutsRef = collection(db, "workouts");
    const q = query(
      workoutsRef,
      where("routineId", "==", routineId),
      orderBy("dayOfWeek")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
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

export const saveCompleteWorkoutInfo = async (
  uid,
  workoutPlan,
  workoutInfo
) => {
  const batch = writeBatch(db);

  try {
    const userRef = doc(db, "users", uid);
    batch.set(userRef, workoutInfo, { merge: true });

    const routineRef = doc(collection(db, "routines"));
    const routineData = {
      title: workoutPlan.title,
      fitnessLevel: workoutPlan.fitnessLevel,
      goal: workoutPlan.goal,
      userId: uid,
      createdAt: serverTimestamp(),
    };
    batch.set(routineRef, routineData);

    workoutPlan.days.forEach((day) => {
      const workoutRef = doc(collection(db, "workouts"));
      const workoutData = {
        name: day.name,
        day: day.day,
        dayOfWeek: day.dayOfWeek,
        routineId: routineRef.id,
        userId: uid,
        exercises:
          day.name.toLowerCase() === "rest"
            ? []
            : day.exercises.map((exercise) => ({
                name: exercise.name,
                gifUrl: exercise.gifUrl,
                sets: exercise.sets,
                reps: exercise.reps,
                rest: exercise.rest,
              })),
        createdAt: serverTimestamp(),
      };

      batch.set(workoutRef, workoutData);
    });

    await batch.commit();
    return routineRef.id;
  } catch (error) {
    console.error("Error saving complete workout info:", error);
    throw new Error("Failed to save complete workout info.");
  }
};

export const getAllRoutinesForUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch routines.");
  }

  try {
    const routinesCollection = collection(db, "routines");

    const routinesQuery = query(
      routinesCollection,
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(routinesQuery);

    const routines = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return routines;
  } catch (error) {
    console.error("Error fetching routines from Firestore:", error);
    throw new Error("Failed to fetch routines.");
  }
};

export const startJobInFirestore = async (userId) => {
  const jobsRef = collection(db, "jobs");

  const pendingJobs = await getDocs(
    query(
      jobsRef,
      where("userId", "==", userId),
      where("status", "==", "pending")
    )
  );

  if (!pendingJobs.empty) {
    throw new Error("A job is already running. Please wait for it to finish.");
  }

  const newJobRef = await addDoc(jobsRef, {
    userId,
    startTime: new Date().toISOString(),
    endTime: null,
    status: "pending",
  });

  return newJobRef.id;
};

export const monitorJobInFirestore = (jobId, callback) => {
  console.log("monitoring in firestore");
  const jobRef = doc(db, "jobs", jobId);
  const unsubscribe = onSnapshot(jobRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data());
      console.log(docSnapshot.data());
    } else {
      console.error("Job document does not exist.");
    }
  });

  return unsubscribe;
};

export const completeJobInFirestore = async (jobId, routineId) => {
  const jobRef = doc(db, "jobs", jobId);

  await updateDoc(jobRef, {
    endTime: new Date().toISOString(),
    status: "completed",
    routineId,
  });
};

export const cancelJobInFirestore = async (jobId) => {
  const jobRef = doc(db, "jobs", jobId);

  await updateDoc(jobRef, {
    isRunning: false,
    endTime: new Date().toISOString(),
    status: "cancelled",
  });
};

export const getPendingJobForUser = async (userId) => {
  const jobsCollectionRef = collection(db, "jobs");

  const q = query(
    jobsCollectionRef,
    where("userId", "==", userId),
    where("status", "==", "pending")
  );

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const jobDoc = querySnapshot.docs[0];
      return { jobId: jobDoc.id, ...jobDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user's pending job:", error);
    return null;
  }
};

export const getRoutineIdForJob = async (jobId) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      const jobData = jobSnap.data();
      return jobData.routineId;
    } else {
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error("Error fetching routineId:", error);
    throw error;
  }
};
