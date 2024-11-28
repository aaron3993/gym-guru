import React from "react";
import { Button } from "antd";
import { Link } from "react-scroll";
import "./Home.css";

const Home = () => {
  const navbarHeight = window.innerHeight * 0.08;

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

      <section id="form-section" className="full-page-section">
        <div className="form-container">
          <h2>Get Started with Your Goals</h2>
          <form>
            <input type="text" placeholder="Fitness Level" />
            <input type="text" placeholder="Goals" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
