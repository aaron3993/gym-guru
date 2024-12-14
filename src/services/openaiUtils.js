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
    const exerciseCounts = {
      chest: 20,
      back: 20,
      "upper legs": 20,
      "lower legs": 5,
      "lower arms": 5,
      "upper arms": 20,
      waist: 10,
      shoulders: 15,
      cardio: 15,
    };

    const exercises = await getRandomExercisesForBodyParts(exerciseCounts);

    const exerciseDataString = formatExercisesForInput(
      Object.values(exercises).flat()
    );

    const prompt = `
      Create a structured JSON format for a weekly workout plan for someone whose goal is ${criteria.goal} and fitness level is ${criteria.fitnessLevel}.
      Only output the JSON and no other text.
      Use the following exercises and their gifUrls in your plan:

      ${exerciseDataString}

      The format should include
      - title: ${criteria.fitnessLevel} ${criteria.goal} Routine (Capitalize first letters)
      - fitnessLevel
      - goal
      - days. Each day has the following attributes:
        - day: Monday for example
        - dayOfWeek: 1 for example
        - name: Muscle group trained
        - exercises. At least 4 exercises per day. Each exercise should be approriate for the fitness level and goal and have the following attributes:
          - name: The name of the exercise.
          - gifUrl: The gif URL of the exercise.
          - sets: The number of sets (integer).
          - reps: A string to represent the range of numbers.
          - rest: A string indicating rest duration.
        - Rest days should still be shown but without exercises
        - Include cardio where necessary
    `;

    // // Step 4: Make API request to OpenAI
    // const response = await axios.post(
    //   "https://api.openai.com/v1/completions",
    //   {
    //     model: "text-davinci-003",
    //     prompt,
    //     max_tokens: 2500, // Adjust to ensure sufficient space for the full response
    //     temperature: 0.7,
    //     n: 1,
    //     stop: null,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // Step 5: Parse the AI response
    // const generatedText = response.data.choices[0].text.trim();
    // try {
    //   const parsedJson = JSON.parse(generatedText);
    //   return parsedJson;
    // } catch (jsonError) {
    //   console.error("Error parsing JSON output:", jsonError);
    //   console.error("Raw output:", generatedText);
    //   return null;
    // }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
