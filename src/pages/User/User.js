// src/pages/User/User.js
import React from "react";
import "./User.css";

const User = ({ user }) => {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-container">
      <h1 className="user-profile">User Profile</h1>
      <div className="user-info-item">
        <strong>Name:</strong> {user.displayName}
      </div>
      <div className="user-info-item">
        <strong>Email:</strong> {user.email}
      </div>
      {/* Add more fields if needed */}
    </div>
  );
};

export default User;
