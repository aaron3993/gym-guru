import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const ProfileOverview = ({ profile }) => {
  return (
    <div className="profile-overview">
      <div className="profile-field">
        <Text strong className="profile-label">
          Email:
        </Text>
        <Text>{profile.email || "Not Set"}</Text>
      </div>
    </div>
  );
};

export default ProfileOverview;
