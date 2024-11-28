import React, { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const GenerateWorkoutModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Values: ", values);
    onClose();
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
            { required: true, message: "Please enter your fitness level" },
          ]}
        >
          <Input placeholder="Beginner, Intermediate, Advanced" />
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
