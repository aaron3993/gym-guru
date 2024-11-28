import React from "react";
import { Button } from "antd";
import { Link } from "react-scroll";
import GoalsForm from "../../components/GoalsForm/GoalsForm";
import "./Home.css";

const Home = () => {
  const navbarHeight = window.innerHeight * 0.08; // Adjusting for the navbar height

  return (
    <div className="home-page">
      <section id="landing-section" className="full-page-section">
        <div className="content-container">
          <h1 className="app-title">Gym Guru</h1>
          <p className="slogan">Customize Your Journey, Sculpt Your Success.</p>
          <Link
            to="form-section"
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

      {/* Render the form as a separate component */}
      <section id="form-section" className="full-page-section">
        <GoalsForm />
      </section>
    </div>
  );
};

export default Home;
