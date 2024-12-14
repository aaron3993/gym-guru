import axios from "axios";

export const fetchAllExercises = async () => {
  const options = {
    params: {
      limit: "1000",
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

export const fetchExercisesByBodyPart = async (bodyPart) => {
  const options = {
    params: {
      bodyPart: bodyPart,
      limit: "1000",
    },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
      options
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for ${bodyPart}:`, error);
    return [];
  }
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomExercisesForBodyParts = async (exerciseCounts) => {
  const exercisesByBodyPart = {};

  for (const [bodyPart, count] of Object.entries(exerciseCounts)) {
    const exercises = await fetchExercisesByBodyPart(bodyPart);

    if (exercises.length > 0) {
      const shuffledExercises = shuffleArray(exercises);
      const randomExercises = shuffledExercises
        .slice(0, count)
        .map((exercise) => ({
          name: exercise.name,
          gifUrl: exercise.gifUrl,
        }));

      exercisesByBodyPart[bodyPart] = randomExercises;
    } else {
      exercisesByBodyPart[bodyPart] = [];
    }
  }

  return exercisesByBodyPart;
};
