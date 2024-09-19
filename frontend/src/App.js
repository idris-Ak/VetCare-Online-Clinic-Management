import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import vets from './components/data/vets';
import AllVetMembers from './pages/AllVetMembers';
import Appointments from './pages/AppointmentPage/Appointments';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MedicalRecords from './pages/MedicalRecords';
import Prescription from './pages/Prescriptionrefill/Prescription.js';
import SignUp from './pages/SignUp';
import VetProfilePage from './pages/VetProfilePage';

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
          <Route path="/MedicalRecords" element={<MedicalRecords />} />
          <Route path="/AppointmentPage/Appointments" element={<Appointments />}></Route>
          {/* Add the Prescription route */}
          <Route path="/prescription" element={<Prescription />} />  {/* New route for Prescription page */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
