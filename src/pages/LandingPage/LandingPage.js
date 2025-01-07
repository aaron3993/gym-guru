import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Transform Your Fitness Journey</h1>
          <p>
            Build muscle, burn fat, and achieve your goals with personalized
            workout plans tailored just for you.
          </p>
          <Button
            className="hero-cta-button"
            type="primary"
            size="large"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
        <div className="hero-image">
          <img
            src="/images/equipment.avif"
            alt="Fitness Motivation"
            width="500"
          />
        </div>
      </section>

      <section className="about-section">
        <h2>About Me</h2>
        <p>
          I'm a dedicated fitness coach with over ten years of experience
          getting people in shape and also possess two years of professional
          experience as a full-stack software developer. I specialize in
          building user-centric web applications, and my passion for fitness led
          me to create a platform that combines technology and personalized
          coaching. Whether you're looking to build muscle, lose fat, or stay in
          shape, I provide tailored plans to fit your needs, leveraging my
          technical expertise to track your progress efficiently.
        </p>
        <img
          src="/images/about-me.jpg"
          alt="About Me"
          width="400"
          className="about-image"
        />
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>Personalized Plans</h3>
            <p>Get workout plans created using AI specific to your needs.</p>
          </div>
          <div className="feature-card">
            <h3>Customize your workouts</h3>
            <p>Create and modify workouts using our library of exercises.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start?</h2>
        <Button type="primary" size="large" onClick={handleGetStarted}>
          Sign Up Now
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
