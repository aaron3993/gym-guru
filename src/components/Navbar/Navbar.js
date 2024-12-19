import React, { useState, useEffect } from "react";
import { Drawer, Button, Badge, notification, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useJob } from "../../contexts/JobContext";
import "./Navbar.css";
import LoadingSpinner from "../LoadingSpinner";

const Navbar = ({ onLogout }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { jobState } = useJob();
  const navigate = useNavigate();

  useEffect(() => {
    if (jobState?.status === "completed") {
      notification.success({
        message: "Job Completed",
        description: "Your job has been successfully completed.",
        placement: "topRight",
      });
    }
  }, [jobState?.status]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-links desktop-nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
        <Link to="/routines" className="nav-link">
          Routines
        </Link>
      </div>
      <div>
        {jobState?.status === "pending" && (
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
        <Button onClick={showDrawer}>☰</Button>
        {jobState?.status === "pending" && (
          <span className="mobile-job-status">
            Generating your routine... <Spin />
          </span>
        )}
      </div>
      <Drawer
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        className="custom-drawer"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          width: "50%",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div>
          <Link to="/" className="drawer-link" onClick={closeDrawer}>
            Home
          </Link>
          <Link to="/profile" className="drawer-link" onClick={closeDrawer}>
            Profile
          </Link>
          <Link to="/workouts" className="drawer-link" onClick={closeDrawer}>
            Workouts
          </Link>
          <Link to="/routines" className="drawer-link" onClick={closeDrawer}>
            Routines
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
