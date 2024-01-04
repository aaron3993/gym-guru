import React from "react";
import { Button } from "antd";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <div className="content-container">
        <div className="cta-container">
          <h1 className="app-name">Gym Guru</h1>
          <p className="slogan">Customize Your Journey, Sculpt Your Success.</p>
          <Button type="primary" className="cta-button">
            Create Workout
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
