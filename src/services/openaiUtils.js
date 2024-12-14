import axios from "axios";
import { getRandomExercisesForBodyParts } from "./exerciseDBUtils";

const formatExercisesForInput = (exercises) => {
  return exercises
    .map((exercise) => {
      return {
        name: exercise.name,
        gifUrl: exercise.gifUrl,
      };
    })
    .map((exercise) => JSON.stringify(exercise))
    .join(", ");
};

export const generateWorkoutPlan = async (criteria) => {
  try {
    // const exerciseCounts = {
    //   chest: 10,
    //   back: 10,
    //   "upper legs": 10,
    //   "lower legs": 2,
    //   "lower arms": 2,
    //   "upper arms": 10,
    //   waist: 7,
    //   shoulders: 10,
    //   cardio: 5,
    // };
    const exerciseCounts = {
      chest: 12,
      back: 15,
      "upper legs": 12,
      "lower legs": 2,
      "upper arms": 10,
      waist: 8,
      shoulders: 12,
      cardio: 10,
    };

    const exercises = await getRandomExercisesForBodyParts(exerciseCounts);

    const exerciseDataString = formatExercisesForInput(
      Object.values(exercises).flat()
    );

    const messages = [
      {
        role: "system",
        content:
          "You are a fitness expert who creates structured workout plans in JSON format.",
      },
      {
        role: "user",
        content: `
          Create a structured JSON format for a weekly workout plan for someone whose goal is ${criteria.goal} and fitness level is ${criteria.fitnessLevel}.
          Only output the JSON and no other text.
          Use the following exercises and their gifUrls in your plan:

          ${exerciseDataString}

          The format should include:
          - title: ${criteria.fitnessLevel} ${criteria.goal} Routine (Capitalize first letters)
          - fitnessLevel
          - goal
          - days. Each day has the following attributes:
            - day: Monday for example
            - dayOfWeek: 1 for example
            - name: Muscle group trained
            - exercises. Four to seven exercises per weight training day. Each exercise should be appropriate for the fitness level and goal and have the following attributes:
              - name: The name of the exercise.
              - gifUrl: The gif URL of the exercise.
              - sets: The number of sets (integer).
              - reps: A string to represent the range of numbers.
              - rest: A string indicating rest duration.
            - Rest days should still be shown but without exercises
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
        max_tokens: 2500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.choices[0].message.content.trim();
    try {
      const parsedJson = JSON.parse(generatedText);
      return parsedJson;
    } catch (jsonError) {
      console.error("Error parsing JSON output:", jsonError);
      console.error("Raw output:", generatedText);
      return null;
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
