import React, { useState } from "react";
import { Drawer, Button, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useJob } from "../../contexts/JobContext";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { status } = useJob();
  const navigate = useNavigate();

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-links desktop-nav">
        <Link to="/" className="nav-link home-link">
          Gym Guru
        </Link>
        <Link to="/routines" className="nav-link">
          Routines
        </Link>
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
      </div>
      <div>
        {status === "pending" && (
          <span className="job-status">
            Generating your routine... <Spin />
          </span>
        )}

        <Button
          type="primary"
          className="logout-btn desktop-nav"
          onClick={async () => {
            await onLogout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <div className="mobile-nav">
        {status === "pending" && (
          <span className="mobile-job-status">
            Generating your routine... <Spin />
          </span>
        )}

        <span className="mobile-job-status">
          Generating your routine... <Spin />
        </span>
        <Button className="hamburger-btn" onClick={showDrawer}>
          ☰
        </Button>
      </div>
      <Drawer
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        className="custom-drawer"
        style={{
          backgroundColor: "white",
          color: "black",
          width: "60%",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div>
          <Link
            to="/"
            className="drawer-link home-drawer-link"
            onClick={closeDrawer}
          >
            Gym Guru
          </Link>
          <Link to="/routines" className="drawer-link" onClick={closeDrawer}>
            Routines
          </Link>
          <Link to="/workouts" className="drawer-link" onClick={closeDrawer}>
            Workouts
          </Link>
          <Link to="/profile" className="drawer-link" onClick={closeDrawer}>
            Profile
          </Link>
        </div>
        <Button
          type="primary"
          danger
          className="logout-btn"
          onClick={async () => {
            await onLogout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Drawer>
    </nav>
  );
};

export default Navbar;
