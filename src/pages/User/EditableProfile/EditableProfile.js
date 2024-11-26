import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, message } from "antd";
import { updateUserProfile } from "../../../utils/firestoreUtils";
import { useAuth } from "../../../contexts/AuthContext";
import "./EditableProfile.css";

const { Text } = Typography;
const { Option } = Select;

const EditableProfile = ({ userData }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialProfile = {
    email: userData?.email || user?.email || "Not Set",
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    weight: userData?.weight || "",
    height: userData?.height || "",
    age: userData?.age || "",
    sex: userData?.sex || "",
  };

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
        <Form.Item label="Email" name="email" className="non-editable-field">
          <Text>{initialProfile.email}</Text>
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "First Name is required." }]}
        >
          <Input disabled={!isEditing} className="editable-input" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Last Name is required." }]}
        >
          <Input disabled={!isEditing} className="editable-input" />
        </Form.Item>

        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[
            { required: true, message: "Weight is required." },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid weight."),
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
            { required: true, message: "Height is required." },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid height."),
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
            { required: true, message: "Age is required." },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject("Enter a valid age."),
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
          rules={[{ required: true, message: "Sex is required." }]}
        >
          <Select disabled={!isEditing} className="editable-select">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
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
