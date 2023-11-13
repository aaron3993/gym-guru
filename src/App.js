import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import wgerApi from './api/wgerApi';

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    // wgerApi.get('/exercise/')
    // .then(response => {
    //   console.log('Wger API initialized:', response.data);
    //   const exerciseNames = response.data.results.map(result => result.name)
    //   console.log({exerciseNames})
    //   setExerciseData(response.data.results)
    // })
    // .catch(error => {
    //   console.error('Error initializing Wger API:', error);
    // });

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log({user})
            setAuthenticated(true);
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
        }
      });
  }, []);

  return (
    <Router>
      {/* <Navbar isAuthenticated={isAuthenticated} /> */}
      <Routes>
        <Route path="/" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;