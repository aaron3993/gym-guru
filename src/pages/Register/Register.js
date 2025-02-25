import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Alert, Input, Button, Form } from "antd";
import { registerUser } from "../../utils/firestoreUtils";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const onSubmit = async () => {
    try {
      const result = await registerUser(email, password);

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
                  className="input"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ message: "Please enter your password" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  className="input"
                  autoComplete="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Form.Item>

              <Button className="register-btn" type="primary" htmlType="submit">
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
