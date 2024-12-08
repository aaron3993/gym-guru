import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import GenerateWorkoutModal from "../../components/GenerateWorkoutModal";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleManualWorkout = () => {
    navigate("/workouts");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="home-page">
      <section id="landing-section" className="full-page-section">
        <div className="content-container">
          <h1 className="app-title">Gym Guru</h1>
          <p className="slogan">Customize Your Journey, Sculpt Your Success.</p>
          <Link to="options-section" smooth={true} duration={800}>
            <Button type="primary" className="cta-button">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <section id="options-section" className="full-page-section">
        <div className="options-container">
          <h2>Choose Your Workout Creation Method</h2>
          <div className="button-options">
            <div className="option">
              <Button
                type="primary"
                className="manual-button"
                onClick={handleManualWorkout}
              >
                Create Workouts Manually
              </Button>
              <p className="option-note">
                Customize your workouts by selecting exercises, reps, and sets.
                Perfect for those who prefer a hands-on approach.
              </p>
            </div>
            <div className="option">
              <Button
                type="primary"
                disabled
                className="ai-button"
                onClick={showModal}
              >
                Generate with AI
              </Button>
              <p className="option-note">
                *Coming Soon! Use our AI tool to create a personalized program
                quickly. Just fill out the form, and we'll handle the rest!
              </p>
            </div>
          </div>
        </div>
      </section>

      <GenerateWorkoutModal isVisible={isModalVisible} onClose={closeModal} />
    </div>
  );
};

export default Home;
