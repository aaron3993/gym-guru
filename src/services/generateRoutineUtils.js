import axios from "axios";
import { getAllExerciseDetailsByBodyPart } from "./exerciseDBUtils";
import { fetchAuthToken } from "../utils/authUtils";

const fetchWorkoutPlanFromLambda = async (
  criteria,
  exerciseDetails,
  userId,
  jobId
) => {
  const token = await fetchAuthToken();

  const response = await axios.post(
    process.env.REACT_APP_GEMINI_API_GATEWAY,
    { criteria, exerciseDetails, userId, jobId },
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

    const lambdaResponse = await fetchWorkoutPlanFromLambda(
      criteria,
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
