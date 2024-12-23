import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Select, Button, notification } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useJob } from "../contexts/JobContext";
import { generateWorkoutPlan } from "../services/openaiUtils";
import { saveCompleteWorkoutInfo } from "../utils/firestoreUtils";

const { Option } = Select;

const GenerateRoutineModal = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startJob, status, completeJob } = useJob();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    form.resetFields();

    const jobId = await startJob(user.uid);

    notification.info({
      message: "Routine Generation Started",
      description: (
        <span>
          Your AI-generated workout routine is being prepared. While you wait,{" "}
          <a href="/workouts">check out our custom workouts page</a> for more
          options!
        </span>
      ),
      placement: "topRight",
      duration: 5,
    });

    onClose();
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

      await completeJob(jobId, routineId);

      navigate(`/routines/${routineId}`);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          "An error occurred while generating your workout routine. Please try again.",
        placement: "topRight",
      });
    }
  };

  return (
    <Modal
      title="Generate Your Personalized Routine"
      open={isVisible}
      footer={null}
      onCancel={onClose}
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
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={status === "pending"}
            disabled={status === "pending"}
          >
            Generate Routine
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GenerateRoutineModal;
