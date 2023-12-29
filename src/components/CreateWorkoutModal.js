import React, { useState } from "react";
import Modal from "antd/lib/modal/Modal";
import { Input, Button, Form, Typography } from "antd";
import "./SharedModal.css";

const { Text } = Typography;

const CreateWorkoutModal = ({ isOpen, onRequestClose, onCreateWorkout }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const handleCreateWorkout = () => {
    const workoutName = form.getFieldValue("workoutName");

    if (!workoutName || workoutName.trim().length === 0) {
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const validatedWorkoutName = values?.workoutName;

        if (
          validatedWorkoutName.length < 1 ||
          validatedWorkoutName.length > 100
        ) {
          setError("Workout name must be between 1 and 100 characters.");
          return;
        }

        onCreateWorkout(validatedWorkoutName);
        form.resetFields();
        onRequestClose();
      })
      .catch((error) => {
        console.error("Form validation error:", error);
        setError(
          "An error occurred while validating the form. Please try again."
        );
      });
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
      title="Create a New Workout"
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
        <Form.Item label="Workout Name" name="workoutName">
          <Input
            placeholder="Workout Name"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </Form.Item>
        {error && <Text type="danger">{error}</Text>}
      </Form>
    </Modal>
  );
};

export default CreateWorkoutModal;
