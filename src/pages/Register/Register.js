// Register.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Alert, Input, Button, Form, Typography } from "antd";
import { registerUser } from "../../utils/firestoreUtils";
import "./Register.css";

const { Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const onSubmit = async () => {
    try {
      const result = await registerUser(
        firstName,
        lastName,
        email,
        password,
        username
      );

      if (result.success) {
        navigate("/");
      } else {
        setAlertMessage(result.error.message || "Registration failed.");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("An unexpected error occurred. Please try again.");
      setAlertType("error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <main>
      <section className="register-layout">
        <div className="signup-container">
          <div>
            <p className="title">Gym Guru</p>
            {alertMessage && (
              <Alert
                message={alertMessage}
                type={alertType}
                showIcon
                closable
                onClose={() => setAlertMessage("")}
                style={{ marginBottom: 16 }}
              />
            )}
            <Form onKeyDown={handleKeyDown}>
              <div>
                <label htmlFor="first-name" className="signup-container-label">
                  First Name
                </label>
                <Input
                  type="text"
                  className="signup-container-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="last-name" className="signup-container-label">
                  Last Name
                </label>
                <Input
                  type="text"
                  className="signup-container-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last name"
                />
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="signup-container-label"
                >
                  Email address
                </label>
                <Input
                  type="email"
                  className="signup-container-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="signup-container-label">
                  Password
                </label>
                <Input.Password
                  className="signup-container-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>

              <div>
                <label htmlFor="username" className="signup-container-label">
                  Username
                </label>
                <Input
                  type="text"
                  className="signup-container-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                />
              </div>

              <Button type="primary" onClick={onSubmit}>
                Sign up
              </Button>
            </Form>

            <p>
              Already have an account? <NavLink to="/login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
