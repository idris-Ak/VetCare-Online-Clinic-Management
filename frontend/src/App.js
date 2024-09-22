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
import VetProfilePage from '../src/pages/VetProfilePage'; // Make sure to create this component
import vets from '../src/components/data/vets';
import Appointments from './pages/AppointmentPage/Appointments';
import AllVetMembers from './pages/AllVetMembers';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isLoggedIn')));
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    const loginUser = (userData) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);  
    setIsLoggedIn(true); 
  };
    const logoutUser = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);  
  };

  return (
    <Router>
      <div className="App">
      <div className="navbar-spacer" style={{ height: '65px', backgroundColor: '#68ccd4' }}></div> {/* Spacer div */}
        <Navbar logoutUser={logoutUser} isLoggedIn={isLoggedIn} user={user} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-vets" element={<AllVetMembers vets={vets} />} />
          {vets.map(vet => (
            <Route key={vet.id} path={vet.detailPath} element={<VetProfilePage vet={vet} />} />
          ))}
          <Route path="/login" element={<Login loginUser={loginUser} />} />
          <Route path="/signup" element={<SignUp loginUser={loginUser} />} />
          <Route path="/VetCareDashboard" element={<VetCareDashboard />} />
          <Route path="/AppointmentPage/Appointments" element={<Appointments />}></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
