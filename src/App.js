import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/home';
import Login from './Login/login';
import Register from './Register/register';
import Navbar from './Navbar/navbar';
// import firebase from 'firebase/app';
// import 'firebase/auth';

const App = () => {
  // const isAuthenticated = firebase.auth().currentUser !== null;

  return (
    <Router>
      {/* <Navbar isAuthenticated={isAuthenticated} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;