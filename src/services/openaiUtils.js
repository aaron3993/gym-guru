import axios from "axios";
import { formatGoalsAndFitnessLevelsText } from "../utils/dataUtils";
import { getAllExerciseDetailsByBodyPart } from "./exerciseDBUtils";

const formatExercisesForInput = (exerciseNamesAndGifUrls) => {
  return Object.keys(exerciseNamesAndGifUrls).join(",");
};

const addGifUrlsToWorkoutPlan = (workoutData, exerciseDetails) => {
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
              - name: The name of the exercise.
              - gifUrl: The gif URL of the exercise (if it exists).
              - sets: The number of sets (integer).
              - reps: A string to represent the range of numbers.
              - rest: A string indicating rest duration.
            - Rest days should still be shown but with an empty exercises array
            - Include cardio where necessary.
        `,
      },
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const generatedText = response.data.choices[0].message.content.trim();
    if (!generatedText) {
      throw new Error("Failed to retrieve content from API response");
    }

    let parsedText;
    try {
      parsedText = JSON.parse(generatedText);
    } catch (error) {
      throw new Error("Failed to parse API response as JSON");
    }

    const workoutPlan = addGifUrlsToWorkoutPlan(parsedText, exerciseDetails);
    if (!workoutPlan) {
      throw new Error("Failed to add GIF URLs to workout plan");
    }

    return workoutPlan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
