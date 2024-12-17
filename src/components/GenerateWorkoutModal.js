import React, { useState } from "react";
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
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    try {
      form.resetFields();
      setLoading(true);

      try {
        const workoutPlan = await generateWorkoutPlan(values);
        if (!workoutPlan) {
          throw new Error("Failed to generate a valid workout plan.");
        }
        const routineId = await saveCompleteWorkoutInfo(
          user.uid,
          workoutPlan,
          values
        );
        if (!routineId) {
          throw new Error("Failed to save workout information.");
        }

        message.success({
          content: "Workout plan generated successfully!",
          key: "generateWorkout",
        });

        navigate(`/routines/${routineId}`);
      } catch (error) {
        message.error({
          content: `Error: ${error.message}`,
          key: "generateWorkout",
        });
      }
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Generate Your Personalized Workout"
      open={isVisible}
      onCancel={!loading ? onClose : () => {}}
      footer={null}
    >
      {loading ? (
        <Button type="primary" block loading={loading}>
          Generating Workout...this may take a moment.
        </Button>
      ) : (
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
            <Button type="primary" htmlType="submit" block loading={loading}>
              Generate Workout
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default GenerateWorkoutModal;
