import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/workouts");
  };

  return (
    <div className="home-page">
      <div className="content-container">
        <div className="cta-container">
          <h1 className="app-title">Gym Guru</h1>
          <p className="slogan">Customize Your Journey, Sculpt Your Success.</p>
          <Button
            type="primary"
            className="cta-button"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
        <div className="image-container">
          <img
            src="/images/watch-with-dumbbells-barbell-mat-sports-3d-rendering-illustration-retro-wave-style_499459-574-2.avif"
            alt="AVIF Image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
