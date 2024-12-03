import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, message } from "antd";
import { updateUserProfile } from "../../../utils/firestoreUtils";
import { formatText } from "../../../utils/formatTextUtils";
import { useAuth } from "../../../contexts/AuthContext";
import "./EditableProfile.css";

const { Text } = Typography;
const { Option } = Select;

const EditableProfile = ({ userData }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const formatUserProfile = (userData) => {
    return {
      ...userData,
      fitnessLevel: formatText(userData.fitnessLevel),
      goals: formatText(userData.goals),
    };
  };

  const initialProfile = formatUserProfile({
    email: userData?.email || user?.email || "Not Set",
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    weight: userData?.weight || "",
    height: userData?.height || "",
    age: userData?.age || "",
    sex: userData?.sex || "",
    fitnessLevel: userData?.fitnessLevel || "",
    goals: userData?.goals || "",
  });

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateUserProfile(user.uid, values);
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        message.error("Please fix the errors before saving.");
      } else {
        message.error("Failed to update profile. Please try again.");
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  return (
    <div className="editable-profile-container">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialProfile}
        className="editable-profile-form"
      >
        <Form.Item>
          <Text>
            <b>Email: {initialProfile.email}</b>
          </Text>
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ message: "First Name is required." }]}
        >
          <Input disabled={!isEditing} className="editable-input" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ message: "Last Name is required." }]}
        >
          <Input disabled={!isEditing} className="editable-input" />
        </Form.Item>
        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve(); // No error if empty
                }
                return value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid weight.");
              },
            },
          ]}
        >
          <Input
            type="number"
            disabled={!isEditing}
            className="editable-input"
          />
        </Form.Item>

        <Form.Item
          label="Height (cm)"
          name="height"
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve(); // No error if empty
                }
                return value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid height.");
              },
            },
          ]}
        >
          <Input
            type="number"
            disabled={!isEditing}
            className="editable-input"
          />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve(); // No error if empty
                }
                return value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid age.");
              },
            },
          ]}
        >
          <Input
            type="number"
            disabled={!isEditing}
            className="editable-input"
          />
        </Form.Item>

        <Form.Item
          label="Sex"
          name="sex"
          rules={[{ message: "Sex is required." }]}
        >
          <Select disabled={!isEditing} className="editable-select">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Fitness Level"
          name="fitnessLevel"
          rules={[{ message: "Fitness Level is required." }]}
        >
          <Select disabled={!isEditing} className="editable-select">
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Goals"
          name="goals"
          rules={[{ message: "Please select your goals" }]}
        >
          <Select disabled={!isEditing} className="editable-select">
            <Option value="weightLoss">Weight Loss</Option>
            <Option value="muscleGain">Muscle Gain</Option>
            <Option value="endurance">Endurance</Option>
            <Option value="strength">Strength</Option>
            <Option value="generalFitness">General Fitness</Option>
          </Select>
        </Form.Item>

        <div className="editable-profile-actions">
          {isEditing ? (
            <>
              <Button
                type="default"
                onClick={handleCancel}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                className="save-button"
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              type="default"
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              Edit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default EditableProfile;
