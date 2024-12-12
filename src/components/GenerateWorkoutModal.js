import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Select, Button, message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { generateWorkoutPlan } from "../services/openaiUtils";
import { saveCompleteWorkoutInfo } from "../utils/firestoreUtils";

const { Option } = Select;

const GenerateWorkoutModal = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/mock-workout-plan.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const handleFinish = async (values) => {
    try {
      form.resetFields();

      message.loading({
        content: "Generating your workout plan...",
        key: "generateWorkout",
      });

      if (!data) {
        throw new Error("Mock workout plan data not loaded.");
      }

      const routineId = await saveCompleteWorkoutInfo(user.uid, data, values);
      navigate(`/routines/${routineId}`);
      message.success({
        content: "Workout plan generated and saved successfully!",
        key: "generateWorkout",
      });

      onClose();
    } catch (error) {
      console.error("Error generating workout plan:", error);
      message.error({
        content: "Failed to generate workout plan. Please try again.",
        key: "generateWorkout",
      });
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
          label="Goal"
          name="goal"
          rules={[{ required: true, message: "Please select your goal" }]}
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
