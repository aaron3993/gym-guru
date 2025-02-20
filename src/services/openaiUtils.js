import axios from "axios";
import { formatGoalsAndFitnessLevelsText } from "../utils/dataUtils";
import { getAllExerciseDetailsByBodyPart } from "./exerciseDBUtils";
import { fetchAuthToken } from "../utils/authUtils";

const formatExercisesForInput = (exerciseDetails) => {
  return Object.keys(exerciseDetails).join(",");
};

const fetchWorkoutPlanFromLambda = async (
  token,
  criteria,
  prompt,
  exerciseDetails,
  userId,
  jobId
) => {
  const response = await axios.post(
    process.env.REACT_APP_OPENAI_API_GATEWAY,
    { criteria, prompt, exerciseDetails, userId, jobId },
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

    const prompt = `
      Create a structured JSON format for a weekly workout plan for someone whose goal is ${
        criteria.goal
      } and fitness level is ${criteria.fitnessLevel}.
      Only output the JSON and no other text.
      Use the following exercises in your plan:
      
      ${exerciseNamesString}
      
      The format should include:
      - title: ${criteria.fitnessLevel} ${formatGoalsAndFitnessLevelsText(
      criteria.goal
    )} Routine (Capitalize first letters)
      - fitnessLevel
      - goal
      - days. Each day has the following attributes:
        - day: e.g., "Monday"
        - dayOfWeek: e.g., 1
        - name: Muscle group trained
        - exercises: An array of 4-7 exercises per weight training day. Each exercise should have the following attributes:
          - id: Empty string
          - name: The name of the exercise in lowercase
          - gifUrl: Empty string
          - sets: The number of sets (integer)
          - reps: A string to represent the range of reps (e.g., "8-12")
          - rest: The rest duration (e.g., "60 seconds")
        - Rest days should have an empty exercises array.
        - Include cardio where necessary.
      `;

    const token = await fetchAuthToken();

    const lambdaResponse = await fetchWorkoutPlanFromLambda(
      token,
      criteria,
      prompt,
      exerciseDetails,
      userId,
      jobId
    );

    try {
      return lambdaResponse.data;
    } catch (error) {
      console.error("Error calling Lambda function:", error);
      return null;
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
