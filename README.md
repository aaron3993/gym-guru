# Gym Guru - Your Personal Workout Assistant

Welcome to Gym Guru, your go-to workout app for creating and managing personalized fitness routines. Whether you're a seasoned gym enthusiast or just starting your fitness journey, Gym Guru empowers you to design and track workouts tailored to your goals. The app uses an extensive and optimized algorithm to combine the power of the OpenAI API, ExerciseDB, and Firestore to create the most effective and personalized workout routines.

Live website: https://gymguru-37ed9.web.app/

## Features

- **User Registration:** Create your account to unlock the full potential of Gym Guru. Your personalized profile allows you to save and revisit your workout routines seamlessly.

- **Weekly Workout Plan Generation (Powered by Gemini AI):** Generate a customized weekly workout plan using Google's Gemini API. Based on your preferences and goals, Gym Guru creates a plan designed to keep you on track and motivated.

- **Real-Time Feedback**: Each workout routine generation creates a background job that runs asynchronously. Jobs are actively monitored for progress and completion to ensure reliability and provide real-time updates to users.

- **Create Custom Workouts:** Tailor your fitness experience by crafting custom workouts. Specify exercises, sets, reps, and more to design a routine that aligns with your fitness objectives.

- **Exercise Database:** Browse and search through a vast database of exercises to add to your workouts. Filter exercises based on muscle groups, equipment, and difficulty level to find the perfect fit for your routine.

- **Caching Implementation:** Implements caching to reduce redundant API calls, significantly improving app performance and reducing load times for a smoother user experience.

- **Easy Setup:** Get started quickly by running the following commands in the main directory:
  ```bash
  npm install
  npm start
  ```

## Technologies Used

- **React:** Building a dynamic and responsive user interface.
- **Google Gemini API:** Used for generating personalized weekly workout plans based on user goals and preferences.
- **Firebase Auth:** Enabling user authentication for a secure registration and login experience, and user management.
- **Firestore:** Storing user profiles, workouts, routines, jobs, and exercise data in a scalable NoSQL database.
- **ExerciseDB (RapidAPI):** Leveraging the RapidAPI ExerciseDB for a comprehensive database of exercises.

## Getting Started

Clone the Repository:

  ```bash
  git clone https://github.com/aaron3993/gym-guru.git
```

Navigate to the Project Directory:

  ```bash
  cd gym-guru
```

Install Dependencies:

  ```bash
  npm install
```

Start the Application:
  
  ```bash
  npm start
```

To access the list of exercises, you must create an account and get the api key from https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb and put it in your local .env file. Api calls are cached to save quota.

To access the ai functionality, you must create an account and get your api key from https://platform.openai.com/docs/overview. Openai will require a paid account to use this functionality.


Access Gym Guru:
Open your web browser and go to http://localhost:3000 to use Gym Guru.
