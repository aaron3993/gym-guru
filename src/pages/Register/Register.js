import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate inputs before proceeding
      if (!name || !email || !password) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      // Proceed with registration if all validations pass
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const docRef = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: user.email,
      });

      console.log('Document written with ID: ', docRef.id);
      navigate('/login');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Use a simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <main>
      <section className="register-layout">
        <div className="signup-container">
          <div>
            <p className="title"> Gym Guru </p>
            <form>
              {/* Styling for the "Name" input field */}
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

              {/* Styling for the "Email" input field */}
              <div>
                <label htmlFor="email-address" className="signup-container-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="signup-container-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+" // Add pattern for email validation
                />
              </div>

              {/* Styling for the "Password" input field */}
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
                  minLength="6" // Add minlength for password length validation
                />
              </div>

              <button type="submit" onClick={onSubmit} className="signup-container-button">
                Sign up
              </button>
            </form>

            <p>
              Already have an account?{' '}
              <NavLink to="/login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
