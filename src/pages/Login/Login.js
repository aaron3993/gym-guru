import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onLogin = (values) => {
    const { email, password } = values;

    if (!email || !password) {
      setAlertMessage("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage =
          "Authentication failed. Please check your email and password.";

        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password"
        ) {
          errorMessage = "Invalid email or password. Please try again.";
        }

        console.error(errorCode, errorMessage);

        setAlertMessage(errorMessage);
        setAlertType("error");
      });
  };

  return (
    <>
      <main>
        <section className="login-layout">
          <div className="login-container">
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
            <Form onFinish={onLogin}>
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
                  autoComplete="email"
                  placeholder="Email"
                  prefix={<MailOutlined />}
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
                  autoComplete="current-password"
                  placeholder="Password"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item>
                <Button className="login-btn" type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>

            <p>
              No account yet? <NavLink to="/register">Sign up</NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
