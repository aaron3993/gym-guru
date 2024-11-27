import React from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {/* <Link to="/exercises" className="nav-link">
          Exercises
        </Link> */}
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
      </div>
      <div className="user-logout-container">
        <div className="user-logout-sub-container">
          <Link to="/user" className="nav-link">
            <span className="user-name">Profile</span>
          </Link>
          <Button
            type="primary"
            className="logout-btn"
            onClick={async () => {
              await onLogout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
