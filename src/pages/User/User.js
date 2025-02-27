import React, { useEffect, useState } from "react";
import { fetchUserData } from "../../utils/firestoreUtils";
import EditableProfile from "./EditableProfile/EditableProfile";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const User = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.uid) {
          const data = await fetchUserData(user.uid);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (!userData) {
    return <LoadingSpinner />;
  }

  return <EditableProfile userData={userData} userId={user?.uid} />;
};

export default User;
