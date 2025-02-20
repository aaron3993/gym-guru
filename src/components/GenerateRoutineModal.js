import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, notification, Typography } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useJob } from "../contexts/JobContext";
import { generateWorkoutPlan } from "../services/generateRoutineUtils";
import {
  checkAndUpdateRateLimit,
  incrementRoutineCount,
} from "../utils/firestoreUtils";

const { Option } = Select;
const { Text } = Typography;

const GenerateRoutineModal = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const { startJob, status } = useJob();
  const [form] = Form.useForm();
  const [rateLimitInfo, setRateLimitInfo] = useState({
    numberOfRoutinesGenerated: 0,
    rateLimited: false,
  });

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const { rateLimited, numberOfRoutinesGenerated } =
          await checkAndUpdateRateLimit(user.uid);
        setRateLimitInfo({ rateLimited, numberOfRoutinesGenerated });
      } catch (error) {
        console.error("Error checking rate limit:", error);
      }
    };

    if (isVisible && user?.uid) {
      checkRateLimit();
    }
  }, [isVisible, user]);

  const handleFinish = async (values) => {
    form.resetFields();

    if (rateLimitInfo.rateLimited) {
      notification.error({
        message: "Rate Limit Exceeded",
        description:
          "You can only generate 3 routines per hour. Please try again later.",
        placement: "topRight",
      });
      return;
    }

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
      const workoutPlan = await generateWorkoutPlan(values, user.uid, jobId);
      if (!workoutPlan) {
        throw new Error("Failed to generate a valid workout plan.");
      }

      await incrementRoutineCount(user.uid);
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
      <Text type="secondary">
        {`You can generate up to 3 routines per hour. You have generated
        ${rateLimitInfo.numberOfRoutinesGenerated} routine${
          rateLimitInfo.numberOfRoutinesGenerated === 1 ? "" : "s"
        } this hour.`}
      </Text>
      {rateLimitInfo.rateLimited && (
        <Text type="danger" style={{ display: "block", marginTop: 10 }}>
          You have reached your limit of 3 routines per hour. Please try again
          later.
        </Text>
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Fitness Level"
          name="fitnessLevel"
          rules={[
            { required: true, message: "Please select your fitness level" },
          ]}
        >
          <Select
            placeholder="Select your fitness level"
            disabled={rateLimitInfo.rateLimited}
          >
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
          <Select
            placeholder="Select your goal"
            disabled={rateLimitInfo.rateLimited}
          >
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
            disabled={status === "pending" || rateLimitInfo.rateLimited}
          >
            {`Generate Routine (${
              3 - rateLimitInfo.numberOfRoutinesGenerated
            })`}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GenerateRoutineModal;
