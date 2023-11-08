import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
// import Home from './Home';
// import Dashboard from './Dashboard';
import Login from './Login/login';
import Register from './Register/register';

function App() {
  return (
    // <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Register />} />
          {/* <Route path="/dashboard" component={Dashboard} /> */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;