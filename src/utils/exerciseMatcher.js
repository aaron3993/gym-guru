import Fuse from "fuse.js";
import { fetchAllExercises } from "../services/exerciseDBUtils";

const exerciseDB = {
  fitnessLevel: "Beginner",
  goal: "Weight Loss",
  week: 1,
  days: [
    {
      day: "Monday",
      name: "Upper Body Strength",
      exercises: [
        {
          exercise: "Push-Ups",
          details: {
            sets: 3,
            reps: 12,
            rest: 60,
          },
        },
        {
          exercise: "Dumbbell Bench Press",
          details: {
            sets: 3,
            reps: 10,
            rest: 60,
          },
        },
        {
          exercise: "Bent-Over Dumbbell Rows",
          details: {
            sets: 3,
            reps: 12,
            rest: 60,
          },
        },
        {
          exercise: "Dumbbell Shoulder Press",
          details: {
            sets: 3,
            reps: 10,
            rest: 60,
          },
        },
      ],
    },
    {
      day: "Tuesday",
      name: "Lower Body Strength",
      exercises: [
        {
          exercise: "Bodyweight Squats",
          details: {
            sets: 3,
            reps: 15,
            rest: 60,
          },
        },
        {
          exercise: "Dumbbell Lunges",
          details: {
            sets: 3,
            reps: 12,
            rest: 60,
          },
        },
        {
          exercise: "Leg Curls",
          details: {
            sets: 3,
            reps: 12,
            rest: 60,
          },
        },
        {
          exercise: "Calf Raises",
          details: {
            sets: 3,
            reps: 15,
            rest: 60,
          },
        },
      ],
    },
    {
      day: "Wednesday",
      name: "Core & Cardio",
      exercises: [
        {
          exercise: "Plank",
          details: {
            sets: 3,
            reps: 30,
            rest: 60,
          },
        },
        {
          exercise: "Bicycle Crunches",
          details: {
            sets: 3,
            reps: 15,
            rest: 60,
          },
        },
        {
          exercise: "Russian Twists",
          details: {
            sets: 3,
            reps: 15,
            rest: 60,
          },
        },
        {
          exercise: "Mountain Climbers",
          details: {
            sets: 3,
            reps: 20,
            rest: 60,
          },
        },
      ],
    },
    // Other days go here...
  ],
};

/**
 * Matches exercises in a workout plan with the closest entries in the exercise database.
 * @param {Object} workoutPlan - The user's workout plan.
 * @returns {Promise<Object>} The workout plan with matched exercises.
 */
export const matchExercises = async (workoutPlan) => {
  try {
    // Fetch exercise database
    const exercises = await fetchAllExercises();

    // Configure Fuse.js for fuzzy searching
    const fuse = new Fuse(exercises, {
      keys: ["name"],
      threshold: 0.3, // Adjust the threshold as needed
    });

    // Match exercises for each day in the workout plan
    exerciseDB.days.forEach((day) => {
      // workoutPlan.days.forEach((day) => {
      if (day.exercises) {
        day.exercises.forEach((exercise) => {
          const result = fuse.search(exercise.exercise)[0];
          if (result) {
            const { name, gifUrl, instructions, target, secondaryMuscles } =
              result.item;
            exercise.exercise = name;
            exercise.gifUrl = gifUrl;
            exercise.instructions = instructions;
            exercise.target = target;
            exercise.secondaryMuscles = secondaryMuscles;
          }
        });
      }
    });
    console.log(exerciseDB);
    return exerciseDB;
  } catch (error) {
    console.error("Error in matchExercises:", error);
    throw error; // Re-throw to handle it in the caller
  }
};

export default matchExercises;
