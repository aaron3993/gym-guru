import axios from "axios";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorageUtils";
import { updateUserWorkoutsWithNewGifUrls } from "../utils/firestoreUtils";

const CACHE_KEY = "allExercises";
const CACHE_TIMESTAMP_KEY = "exerciseCacheTimestamp";

export const fetchAllExercises = async () => {
  const options = {
    params: {
      limit: "1323",
    },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises",
      options
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

const isCacheExpired = () => {
  const lastFetchTimestamp = getFromLocalStorage(CACHE_TIMESTAMP_KEY);
  if (!lastFetchTimestamp) return true;

  const now = Date.now();
  const twelveHoursInMillis = 12 * 60 * 60 * 1000;

  const cacheIsOlderThanTwelveHours =
    now - parseInt(lastFetchTimestamp, 10) > twelveHoursInMillis;

  return cacheIsOlderThanTwelveHours;
};

export const getAllExercisesWithCache = async (userId) => {
  if (!isCacheExpired()) {
    const cachedData = getFromLocalStorage(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
  }

  const allExercises = await fetchAllExercises();

  if (allExercises.length > 0) {
    saveToLocalStorage(CACHE_KEY, allExercises);
    saveToLocalStorage(CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  await updateUserWorkoutsWithNewGifUrls(userId, allExercises);

  return allExercises;
};

export const getExercisesByBodyPart = async (bodyPart) => {
  const allExercises = await getAllExercisesWithCache();
  return allExercises.filter((exercise) => exercise.bodyPart === bodyPart);
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getAllExerciseDetailsByBodyPart = async (exerciseCounts) => {
  try {
    const allExercises = await getAllExercisesWithCache();

    const exerciseNamesAndDetails = {};

    for (const [bodyPart, count] of Object.entries(exerciseCounts)) {
      const exercisesByBodyPart = allExercises.filter(
        (exercise) => exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase()
      );

      const shuffledExercises = shuffleArray(exercisesByBodyPart);

      const selectedExercises = shuffledExercises.slice(0, count);

      selectedExercises.forEach((exercise) => {
        exerciseNamesAndDetails[exercise.name] = {
          id: exercise.id || "",
          gifUrl: exercise.gifUrl || "",
        };
      });
    }
    return exerciseNamesAndDetails;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return {};
  }
};
