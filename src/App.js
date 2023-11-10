import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
// import Home from './Home';
// import Dashboard from './Dashboard';
import Login from './Login/login';
import Register from './Register/register';
import Home from './Home/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/signup" element={<Register/>}/>
          {/* <Route path="/dashboard" component={Dashboard} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;