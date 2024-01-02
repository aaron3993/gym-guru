import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/firestoreUtils";
import { Alert } from "antd";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, error } = await registerUser(name, email, password);
      console.log(user, error);
      if (user) {
        navigate("/");
      } else {
        setAlertMessage(error.message);
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <main>
      <section className="register-layout">
        <div className="signup-container">
          <div>
            <p className="title"> Gym Guru </p>
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
            <form>
              <div>
                <label htmlFor="name" className="signup-container-label">
                  Name
                </label>
                <input
                  type="text"
                  className="signup-container-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="signup-container-label"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="signup-container-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                />
              </div>

              <div>
                <label htmlFor="password" className="signup-container-label">
                  Password
                </label>
                <input
                  type="password"
                  className="signup-container-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                onClick={onSubmit}
                className="signup-container-button"
              >
                Sign up
              </button>
            </form>

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
