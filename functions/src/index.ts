import axios from "axios";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";

// Define the secrets
const openaiApiKey = defineSecret('OPENAI_API_KEY');
const rapidApiKey = defineSecret('RAPID_API_KEY');

export const fetchAllExercises = onCall(
  {
    secrets: [rapidApiKey],
  },
  async (context) => {
    // Retrieve RapidAPI key from secret
    const apiKey = rapidApiKey.value();

    const options = {
      params: {
        limit: "1323",
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
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
      logger.error("Error fetching exercises:", error);
      return [];
    }
  }
);

export const generateWorkoutPlan = onCall(
  {
    secrets: [openaiApiKey],
  },
  async (request) => {
    // Retrieve OpenAI API key from secret
    const apiKey = openaiApiKey.value();
    
    if (!apiKey) {
      logger.error("OpenAI API key is not configured");
      throw new Error("OpenAI API key is missing");
    }

    try {
      const messages = request.data.messages;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const workoutData = JSON.parse(
        response.data.choices[0].message.content.trim()
      );

      return workoutData;
    } catch (error: any) {
      logger.error("Error generating workout plan:", error);
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
  }
);
