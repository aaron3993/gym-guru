import axios from "axios";
import { formatGoalsAndFitnessLevelsText } from "../utils/dataUtils";
import { getAllExerciseDetailsByBodyPart } from "./exerciseDBUtils";
import { fetchAuthToken } from "../utils/authUtils";

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

const fetchWorkoutPlanFromLambda = async (
  token,
  criteria,
  prompt,
  userId,
  jobId
) => {
  const response = await axios.post(
    process.env.REACT_APP_OPENAI_API_GATEWAY,
    { criteria, prompt, userId, jobId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const generateWorkoutPlan = async (criteria, userId, jobId) => {
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

    // const messages = [
    //   {
    //     role: "system",
    //     content:
    //       "You are a fitness expert who creates structured workout plans in JSON format.",
    //   },
    //   {
    //     role: "user",
    //     content: `
    //       Create a structured JSON format for a weekly workout plan for someone whose goal is ${
    //         criteria.goal
    //       } and fitness level is ${criteria.fitnessLevel}.
    //       Only output the JSON and no other text.
    //       Use the following exercises and their gifUrls in your plan:

    //       ${exerciseNamesString}

    //       The format should include:
    //       - title: ${criteria.fitnessLevel} ${formatGoalsAndFitnessLevelsText(
    //       criteria.goal
    //     )} Routine
    //       - fitnessLevel
    //       - goal
    //       - days. Each day has the following attributes:
    //         - day: Monday for example
    //         - dayOfWeek: 1 for example
    //         - name: Muscle group trained
    //         - exercises. Five exercises per weight training day. Each exercise should be appropriate for the fitness level and goal and have the following attributes:
    //           - id: Empty string
    //           - name: The name of the exercise in lower case
    //           - gifUrl: Empty string
    //           - sets: The number of sets (integer)
    //           - reps: A string to represent the range of numbers
    //           - rest: A string indicating rest duration
    //         - Rest days should still be shown but with an empty exercises array
    //         - Include cardio where necessary
    //     `,
    //   },
    // ];

    const prompt = `Create a structured JSON format for a weekly workout plan for someone whose goal is ${
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
      - day: e.g., "Monday"
      - dayOfWeek: e.g., 1
      - name: Muscle group trained
      - exercises: An array of five exercises per weight training day. Each exercise should have the following attributes:
        - id: Empty string
        - name: The name of the exercise in lowercase
        - gifUrl: The gif URL of the exercise
        - sets: The number of sets (integer)
        - reps: A string to represent the range of reps (e.g., "8-12")
        - rest: The rest duration (e.g., "60 seconds")
      - Rest days should have an empty exercises array.
      - Include cardio where necessary, even on rest days if appropriate.`;

    const token = await fetchAuthToken();

    const lambdaResponse = await fetchWorkoutPlanFromLambda(
      token,
      criteria,
      prompt,
      userId,
      jobId
    );

    try {
      return lambdaResponse.data;
      //   let parsedText;
      //   try {
      //     parsedText = JSON.parse(lambdaResponse);
      //   } catch (error) {
      //     throw new Error("Failed to parse API response as JSON");
      //   }
      // const workoutPlan = addDetailsToParsedText(workoutData, exerciseDetails);
      // const workoutPlan = addDetailsToParsedText(parsedText, exerciseDetails);
      // if (!workoutPlan) {
      //   throw new Error("Failed to add GIF URLs to workout plan");
      // }

      // return workoutPlan;
    } catch (error) {
      console.error("Error calling Lambda function:", error);
      return null;
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
