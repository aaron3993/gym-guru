import React from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { useAuth } from "../contexts/AuthContext"; // Accessing the Auth context directly
import { addUserWorkoutInfo } from "../utils/firestoreUtils";

const { Option } = Select;

const GenerateWorkoutModal = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      if (user) {
        await addUserWorkoutInfo(user.uid, values);
        message.success("Workout preferences saved successfully!");
        onClose();
      } else {
        message.error("User not authenticated. Please log in.");
      }
    } catch (error) {
      console.error("Error saving workout preferences:", error);
      message.error("Failed to save preferences. Please try again.");
    }
  };

  return (
    <Modal
      title="Generate Your Personalized Workout"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Fitness Level"
          name="fitnessLevel"
          rules={[
            { required: true, message: "Please select your fitness level" },
          ]}
        >
          <Select placeholder="Select your fitness level">
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Goals"
          name="goals"
          rules={[{ required: true, message: "Please select your goals" }]}
        >
          <Select placeholder="Select your goal">
            <Option value="weightLoss">Weight Loss</Option>
            <Option value="muscleGain">Muscle Gain</Option>
            <Option value="endurance">Endurance</Option>
            <Option value="strength">Strength</Option>
            <Option value="generalFitness">General Fitness</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Generate Workout
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GenerateWorkoutModal;
