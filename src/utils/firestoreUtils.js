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
  Timestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (email, password) => {
  try {
    if (!email || !password) {
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

export const fetchRoutineWithWorkouts = async (routineId) => {
  try {
    const routineRef = doc(db, "routines", routineId);
    const routineDoc = await getDoc(routineRef);

    if (!routineDoc.exists()) {
      throw new Error(`Routine with ID ${routineId} not found.`);
    }

    const routineData = routineDoc.data();

    const workoutsRef = collection(db, "workouts");
    const q = query(
      workoutsRef,
      where("routineId", "==", routineId),
      orderBy("dayOfWeek")
    );
    const querySnapshot = await getDocs(q);

    const workouts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      id: routineDoc.id,
      ...routineData,
      workouts,
    };
  } catch (error) {
    console.error("Error fetching routine with workouts:", error);
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

export const addExerciseToWorkout = async (workoutId, exercise) => {
  const workoutRef = doc(db, "workouts", workoutId);

  await updateDoc(workoutRef, {
    exercises: arrayUnion(exercise),
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
          return {
            ...exercise,
            reps: newReps || "",
            sets: newSets || null,
          };
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
    const workoutDocRef = doc(db, "workouts", workoutId);
    const workoutSnapshot = await getDoc(workoutDocRef);

    let routineId = null;

    if (workoutSnapshot.exists()) {
      const workoutData = workoutSnapshot.data();
      routineId = workoutData.routineId || null;
    } else {
      console.warn(`Workout with ID ${workoutId} does not exist.`);
    }

    await deleteDoc(workoutDocRef);

    return routineId;
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
                id: exercise.id,
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
  const jobRef = doc(db, "jobs", jobId);
  onSnapshot(jobRef, (snapshot) => {
    if (snapshot.exists()) {
      const jobData = snapshot.data();
      callback({ ...jobData, jobId: snapshot.id });
    } else {
      console.error("Job not found");
    }
  });
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

const RATE_LIMIT = 3; // Max routines per hour

// Helper function to check and update the rate limit
export const checkAndUpdateRateLimit = async (userUid) => {
  try {
    const now = Timestamp.now();
    const oneHourAgo = now.toDate();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Get the time 1 hour ago

    // Query for routines generated by the user in the last hour
    const routinesRef = collection(db, "routines");
    const q = query(
      routinesRef,
      where("userId", "==", userUid),
      where("createdAt", ">=", Timestamp.fromDate(oneHourAgo)) // Routines generated within the last hour
    );

    // Fetch the results
    const querySnapshot = await getDocs(q);

    // Get the count of generated routines in the past hour
    const numberOfRoutinesGenerated = querySnapshot.size;

    // Check if the user has exceeded the limit
    const rateLimited = numberOfRoutinesGenerated >= RATE_LIMIT;

    // Return the count and whether the user is rate-limited
    return { rateLimited, numberOfRoutinesGenerated };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    throw new Error("Error checking rate limit.");
  }
};

// Helper function to update the rate limit and create a new routine
export const incrementRoutineCount = async (userUid) => {
  try {
    const routinesRef = collection(db, "routines"); // Reference to the 'routines' collection
    const newRoutineRef = doc(routinesRef); // Create a new document in the 'routines' collection

    // Set the new routine data with user ID and timestamp
    await setDoc(newRoutineRef, {
      userId: userUid,
      createdAt: serverTimestamp(), // Set the creation time using server timestamp
    });

    console.log("Routine count updated for user:", userUid);
  } catch (error) {
    console.error("Error updating routine count:", error);
    throw new Error("Error updating routine count.");
  }
};
