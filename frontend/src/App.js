import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Imported Navigate for redirect
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import vets from './components/data/vets';
import AllVetMembers from './pages/AllVetMembers';
import Appointments from './pages/AppointmentPage/Appointments';
import MedicalRecords from './pages/MedicalRec/MedicalRecords'
import EducationalResource from './pages/EducationalResource'
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MedicalRecords from './pages/MedicalRec/MedicalRecords';
import MyProfile from './pages/MyProfile'; // Assuming MyProfile is located in the 'pages' directory
import Prescription from './pages/Prescriptionrefill/prescription';
import SignUp from './pages/SignUp';

// PrivateRoute component to protect certain routes
function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isLoggedIn')));
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    const loginUser = (userData) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true); 
      setUser(userData);  
    };

    const logoutUser = async () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setUser(null);  
    };


}

export default App;