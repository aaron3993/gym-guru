import React, { useState, useEffect } from "react";
import { Drawer, Button, Spin, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useJob } from "../../contexts/JobContext";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { status } = useJob();
  const navigate = useNavigate();

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setDrawerVisible(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const menuItems = [
    { key: "home", label: <Link to="/">Gym Guru</Link> },
    { key: "routines", label: <Link to="/routines">Routines</Link> },
    { key: "workouts", label: <Link to="/workouts">Workouts</Link> },
    { key: "profile", label: <Link to="/profile">Profile</Link> },
  ];

  return (
    <nav className="navbar">
      {/* Desktop Navigation */}
      {!isMobile && (
        <Menu mode="horizontal" className="desktop-nav">
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
      )}

      <div>
        {status === "pending" && (
          <span className="job-status">
            Generating your routine... <Spin />
          </span>
        )}
        {!isMobile && (
          <Button
            type="primary"
            danger
            className="logout-btn desktop-nav"
            onClick={async () => {
              await onLogout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="mobile-nav">
          {status === "pending" && (
            <span className="mobile-job-status">
              Generating your routine... <Spin />
            </span>
          )}
          <Button
            className="hamburger-btn"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
        </div>
      )}

      <Drawer
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        width="60%"
        styles={{ body: { padding: 0 } }}
      >
        <Menu mode="vertical" onClick={closeDrawer}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
        <Button
          type="primary"
          danger
          block
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
