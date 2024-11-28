import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";
import "./GoalsForm.css";

const GoalsForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // navigate("/confirmation");
  };

  return (
    <div className="goals-form-container">
      <h2>Set Your Fitness Goal</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="goal"
          label="Choose Your Goal"
          rules={[{ required: true, message: "Please select your goal!" }]}
        >
          <Select placeholder="Select a goal">
            <Select.Option value="weightLoss">Weight Loss</Select.Option>
            <Select.Option value="muscleGain">Muscle Gain</Select.Option>
            <Select.Option value="endurance">Endurance</Select.Option>
            <Select.Option value="strength">Strength</Select.Option>
            <Select.Option value="rehab">Rehab</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GoalsForm;
