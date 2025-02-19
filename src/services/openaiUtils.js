import { formatGoalsAndFitnessLevelsText } from "../utils/dataUtils";
import { getAllExerciseDetailsByBodyPart } from "./exerciseDBUtils";
import { callCloudFunction } from "../firebase";

const formatExercisesForInput = (exerciseDetails) => {
  return Object.keys(exerciseDetails).join(",");
};

const addDetailsToParsedText = (workoutData, exerciseDetails) => {
  if (!workoutData || !Array.isArray(workoutData.days)) {
    console.error("Invalid workoutData structure:", workoutData);
    return null;
  }

  return {
    ...workoutData,
    days: workoutData.days.map((day) => ({
      ...day,
      exercises:
        day.exercises.length > 0
          ? day.exercises.map((exercise) => {
              const exerciseDetail = exerciseDetails[exercise.name] || {};
              return {
                ...exercise,
                id: exerciseDetail.id || null,
                gifUrl: exerciseDetail.gifUrl || "",
              };
            })
          : [],
    })),
  };
};

export const generateWorkoutPlan = async (criteria) => {
  try {
    const exerciseCounts = {
      chest: 10,
      back: 10,
      "upper legs": 10,
      "lower legs": 2,
      "lower arms": 2,
      "upper arms": 10,
      waist: 7,
      shoulders: 10,
      cardio: 5,
    };

    const exerciseDetails = await getAllExerciseDetailsByBodyPart(
      exerciseCounts
    );

    const exerciseNamesString = formatExercisesForInput(exerciseDetails);

    if (!exerciseNamesString) {
      throw new Error("Failed to format exercise names for input");
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a fitness expert who creates structured workout plans in JSON format.",
      },
      {
        role: "user",
        content: `
          Create a structured JSON format for a weekly workout plan for someone whose goal is ${
            criteria.goal
          } and fitness level is ${criteria.fitnessLevel}.
          Only output the JSON and no other text.
          Use the following exercises and their gifUrls in your plan:
 
          ${exerciseNamesString}

          The format should include:
          - title: ${criteria.fitnessLevel} ${formatGoalsAndFitnessLevelsText(
          criteria.goal
        )} Routine
          - fitnessLevel
          - goal
          - days. Each day has the following attributes:
            - day: Monday for example
            - dayOfWeek: 1 for example
            - name: Muscle group trained
            - exercises. Five exercises per weight training day. Each exercise should be appropriate for the fitness level and goal and have the following attributes:
              - id: Empty string
              - name: The name of the exercise in lower case
              - gifUrl: Empty string
              - sets: The number of sets (integer)
              - reps: A string to represent the range of numbers
              - rest: A string indicating rest duration
            - Rest days should still be shown but with an empty exercises array
            - Include cardio where necessary
        `,
      },
    ];

    // Call the cloud function to generate the workout plan
    const workoutData = await callCloudFunction('generateWorkoutPlan', { messages });

    const workoutPlan = addDetailsToParsedText(workoutData, exerciseDetails);
    if (!workoutPlan) {
      throw new Error("Failed to add GIF URLs to workout plan");
    }

    return workoutPlan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
