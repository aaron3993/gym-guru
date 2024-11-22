import React, { useState } from "react";
import { Input, Select, Typography, message } from "antd";
import { updateUserProfile } from "../../../utils/firestoreUtils";
import { useAuth } from "../../../contexts/AuthContext";
import "./EditableProfile.css";

const { Text } = Typography;
const { Option } = Select;

const EditableProfile = ({ userData }) => {
  const { user } = useAuth();

  const initialProfile = {
    email: userData?.email || user?.email || "Not Set",
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    weight: userData?.weight || "",
    height: userData?.height || "",
    age: userData?.age || "",
    sex: userData?.sex || "",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [editingField, setEditingField] = useState(null);

  const validateField = (field, value) => {
    if (["weight", "height", "age"].includes(field)) {
      if (!value || isNaN(value) || value <= 0) {
        return "Enter a valid number.";
      }
    }
    if (field === "sex") {
      if (!["Male", "Female", "Other"].includes(value)) {
        return "Select a valid option.";
      }
    }
    return null;
  };

  const handleFieldChange = (field, value) => {
    const error = validateField(field, value);
    setProfile((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFieldBlur = async (field) => {
    if (errors[field]) return;

    try {
      await updateUserProfile(user.uid, { [field]: profile[field] });
      message.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setEditingField(null);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      handleFieldBlur(field);
    }
  };

  return (
    <div className="editable-profile-container">
      {Object.entries(profile).map(([key, value]) => (
        <div key={key} className="profile-field">
          <Text strong className="profile-label">
            {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
          </Text>
          {key === "email" ? (
            // Non-editable email field
            <Text>{value}</Text>
          ) : editingField === key ? (
            <>
              {key === "sex" ? (
                <Select
                  value={value}
                  onChange={(val) => handleFieldChange(key, val)}
                  onBlur={() => handleFieldBlur(key)}
                  style={{ width: 120 }}
                  autoFocus
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              ) : (
                <Input
                  type={
                    ["weight", "height", "age"].includes(key)
                      ? "number"
                      : "text"
                  }
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  onBlur={() => handleFieldBlur(key)}
                  onKeyDown={(e) => handleKeyDown(e, key)}
                  style={{ width: "100px" }}
                  autoFocus
                />
              )}
              {errors[key] && (
                <Text type="danger" className="profile-error">
                  {errors[key]}
                </Text>
              )}
            </>
          ) : (
            <Text
              onClick={() => setEditingField(key)}
              className={key !== "email" ? "clickable-field" : ""}
            >
              {value || "Not Set"}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditableProfile;
