import { auth } from "../firebase";

export const fetchAuthToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
};
