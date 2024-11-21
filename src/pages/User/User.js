import React, { useState, useEffect } from "react";
import { fetchUserData, updateUserProfile } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import ProfileOverview from "./ProfileOverview/ProfileOverview";
import EditableProfile from "./EditableProfile/EditableProfile";

const User = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userProfile = await fetchUserData(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            console.log({ userProfile });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async (updatedProfile) => {
    try {
      await updateUserProfile(user.uid, updatedProfile);
      setProfile(updatedProfile); // Update local state after successful save
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <div className="user-container">
      {profile && (
        <>
          <ProfileOverview profile={profile} />
          <EditableProfile profile={profile} onSave={handleSave} />
        </>
      )}
    </div>
  );
};

export default User;
