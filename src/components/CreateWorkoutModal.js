import React from "react";
import Modal from "antd/lib/modal/Modal";
import { Input, Button, Form, Typography } from "antd";
import { createWorkout, checkIfWorkoutExists } from "../utils/firestoreUtils";
import { useAuth } from "../contexts/AuthContext";
import "./SharedModal.css";

const { Text } = Typography;

const CreateWorkoutModal = ({
  isOpen,
  onRequestClose,
  onCreateWorkout,
  form,
  error,
  setError,
}) => {
  const { user } = useAuth();

  const handleCreateWorkout = async () => {
    try {
      const values = await form.validateFields();

      const validatedWorkoutName = values?.workoutName;

      if (!validatedWorkoutName || validatedWorkoutName.trim().length === 0) {
        setError("Workout name is required.");
        return;
      }

      if (
        validatedWorkoutName.length < 1 ||
        validatedWorkoutName.length > 100
      ) {
        setError("Workout name must be between 1 and 100 characters.");
        return;
      }

      const workoutExists = await checkIfWorkoutExists(
        validatedWorkoutName,
        user.uid
      );

      if (workoutExists) {
        return setError("A workout with this name already exists");
      }

      await createWorkout(validatedWorkoutName, user);

      onCreateWorkout(validatedWorkoutName);

      form.resetFields();

      onRequestClose();
    } catch (error) {
      console.error("Form validation error:", error);
      setError(
        "An error occurred while validating the form. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const workoutName = e.target.value;
    setError("");
    form.setFieldsValue({ workoutName });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateWorkout();
    }
  };

  return (
    <Modal
      title={<div className="modal-title">Create a New Workout</div>}
      open={isOpen}
      onCancel={onRequestClose}
      footer={[
        <Button key="cancel" onClick={onRequestClose}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleCreateWorkout}>
          Create
        </Button>,
      ]}
    >
      <Form form={form}>
        <div>
          <Form.Item className="input-label" name="workoutName">
            <Input
              className="create-workout-input-field"
              placeholder="Workout Name"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Item>
          {error && (
            <Text className="error-text" type="danger">
              {error}
            </Text>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default CreateWorkoutModal;
