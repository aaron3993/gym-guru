import React, { useState } from "react";
import { Button, Typography } from "antd";
import GenerateWorkoutModal from "../../components/GenerateWorkoutModal";
import { useNavigate } from "react-router-dom";
import "./Routines.css";

const { Title } = Typography;

const Routines = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleManualRoutine = () => {
    navigate("/workouts");
  };

  return (
    <div className="routines-page">
      <div className="header">
        <Title level={1}>Your Workout Routines</Title>
        <p>Choose how you want to create your next workout routine!</p>
      </div>

      <div className="options">
        <div className="option">
          <Button
            type="primary"
            onClick={handleManualRoutine}
            className="manual-button"
          >
            Create Manually
          </Button>
          <p className="option-note">
            Customize your routine step by step. Select exercises, reps, and
            sets tailored to your needs.
          </p>
        </div>

        <div className="option">
          <Button type="primary" onClick={showModal} className="ai-button">
            Generate with AI
          </Button>
          <p className="option-note">
            Let our AI design a personalized routine for you in seconds. Just
            provide your goals, and we’ll handle the rest.
          </p>
        </div>
      </div>

      <GenerateWorkoutModal isVisible={isModalVisible} onClose={handleClose} />
    </div>
  );
};

export default Routines;
