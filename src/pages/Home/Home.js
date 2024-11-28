import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const navbarHeight = window.innerHeight * 0.08;

  const handleManualWorkout = () => {
    navigate("/workouts");
  };

  return (
    <div className="home-page">
      <section id="landing-section" className="full-page-section">
        <div className="content-container">
          <h1 className="app-title">Gym Guru</h1>
          <p className="slogan">Customize Your Journey, Sculpt Your Success.</p>
          <Link
            to="options-section"
            smooth={true}
            duration={800}
            offset={-navbarHeight}
          >
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
                className="ai-button"
                // onClick={() =>
                //   document
                //     .getElementById("ai-form")
                //     .scrollIntoView({ behavior: "smooth" })
                // }
              >
                Generate with AI
              </Button>
              <p className="option-note">
                Use our AI tool to create a personalized program quickly. Just
                fill out the form, and we'll handle the rest!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
