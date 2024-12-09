import axios from "axios";

const fetchAllExercises = async () => {
  const options = {
    params: {
      limit: "1000",
    },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises",
      options
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export { fetchAllExercises };
