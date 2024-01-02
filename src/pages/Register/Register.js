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
            <Form onFinish={onSubmit}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ message: "Please enter your first name" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ message: "Please enter your last name" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </Form.Item>

              <Form.Item
                label="Email address"
                name="email"
                rules={[
                  {
                    message: "Please enter your email address",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ message: "Please enter your password" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[{ message: "Please choose a username" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
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
