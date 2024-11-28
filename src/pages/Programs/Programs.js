import React, { useState } from "react";
import { Button, Typography } from "antd";
import GenerateWorkoutModal from "../../components/GenerateWorkoutModal/GenerateWorkoutModal"; // Import the modal component
import "./Programs.css";

const { Title } = Typography;

const Programs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="programs-page">
      <div className="header">
        <Title level={1}>Your Custom Workout Programs</Title>
        <p>
          Explore tailored workout programs designed to meet your fitness goals.
        </p>
      </div>

      <div className="content">
        <Button type="primary" onClick={showModal} className="generate-button">
          Generate a New Workout
        </Button>
      </div>

      <GenerateWorkoutModal isVisible={isModalVisible} onClose={handleClose} />
    </div>
  );
};

export default Programs;
