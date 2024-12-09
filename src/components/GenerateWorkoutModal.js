import React from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { generateWorkoutPlan } from "../services/openaiUtils";
import { matchExercises } from "../utils/exerciseMatcher";

const { Option } = Select;

const GenerateWorkoutModal = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      // Clear existing form values
      form.resetFields();

      message.loading({
        content: "Generating your workout plan...",
        key: "generateWorkout",
      });

      // Generate workout plan from OpenAI
      // const workoutPlan = await generateWorkoutPlan(values);

      // Match exercises using the matcher function
      // const matchedPlan = await matchExercises(workoutPlan);
      const matchedPlan = await matchExercises();

      // Save to Firestore (or handle as needed)
      // await addUserWorkoutInfo(user.uid, matchedPlan);

      message.success({
        content: "Workout plan generated and saved successfully!",
        key: "generateWorkout",
      });

      // Optionally close the modal after success
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
