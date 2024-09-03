import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VetCareDashboard from './pages/VetCareDashboard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isLoggedIn')));

    const logoutUser = async () => {
    localStorage.removeItem('currentUserID');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

 return (
    <Router>
      <div className="App">
        <Navbar logoutUser={logoutUser} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/VetCareDashboard" element={<VetCareDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
