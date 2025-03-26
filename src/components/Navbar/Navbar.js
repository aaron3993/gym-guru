import React, { useState, useEffect } from "react";
import { Drawer, Button, Spin, Menu } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  FireOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
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
    {
      key: "home",
      label: <Link to="/home">Gym Guru</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "routines",
      label: <Link to="/routines">Routines</Link>,
      icon: <UnorderedListOutlined />,
    },
    {
      key: "workouts",
      label: <Link to="/workouts">Workouts</Link>,
      icon: <FireOutlined />,
    },
    {
      key: "profile",
      label: <Link to="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <nav className="navbar">
      {!isMobile && (
        <Menu
          style={{ borderBottom: "none" }}
          mode="horizontal"
          className="desktop-nav"
          items={menuItems.map((item) => ({
            ...item,
            icon: null,
          }))}
        />
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
            icon={<LogoutOutlined />}
            onClick={async () => {
              await onLogout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        )}
      </div>

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
        styles={{
          body: { padding: 0, display: "flex", flexDirection: "column" },
        }}
        className="custom-drawer"
      >
        <Menu
          mode="vertical"
          onClick={closeDrawer}
          className="drawer-menu"
          items={menuItems}
        />
        <div className="drawer-footer">
          <Button
            type="primary"
            danger
            block
            icon={<LogoutOutlined />}
            onClick={async () => {
              await onLogout();
              navigate("/login");
            }}
            className="logout-btn"
          >
            Logout
          </Button>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
