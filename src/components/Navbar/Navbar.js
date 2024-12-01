import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout, user }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
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
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
        <Link to="/programs" className="nav-link">
          Programs
        </Link>
      </div>
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

      <div className="mobile-nav">
        <Button onClick={showDrawer}>☰</Button>
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
          <Link to="/programs" className="drawer-link" onClick={closeDrawer}>
            Programs
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
