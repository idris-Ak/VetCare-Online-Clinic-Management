import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Imported Navigate for redirect
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AllVetMembers from './pages/AllVetMembers';
import Appointments from './pages/AppointmentPage/Appointments';
import EducationalResource from './pages/EducationalResource';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MedicalRecords from './pages/MedicalRec/MedicalRecords';
import MyProfile from './pages/MyProfile'; // Assuming MyProfile is located in the 'pages' directory
import Prescription from './pages/Prescriptionrefill/prescription';
import SignUp from './pages/SignUp';
import VetProfilePage from './pages/VetProfilePage'; // Adjusted relative path

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

    return (
      <Router>
        <div className="App">
          <div className="navbar-spacer" style={{ height: '65px', backgroundColor: '#68ccd4' }}></div> {/* Spacer div */}
          <Navbar logoutUser={logoutUser} isLoggedIn={isLoggedIn} user={user} />
          <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn}/>} />
            <Route path="/all-vets" element={<AllVetMembers />} /> {/* Pass the vets data directly from the backend, if necessary */}
            
            {/* Dynamic route for vet profile pages */}
            <Route path="/vets/:id" element={<VetProfilePage />} /> {/* :id captures the vet ID from the URL */}
            
            <Route path="/login" element={<Login loginUser={loginUser} />} />
            <Route path="/signup" element={<SignUp loginUser={loginUser} />} />
            <Route path="/educational" element={<EducationalResource />} />
            <Route 
              path="/myprofile" 
              element={<MyProfile user={user} setUser={setUser} logoutUser={logoutUser} />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/AppointmentPage/Appointments" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Appointments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/MedicalRecords" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <MedicalRecords />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/prescription" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Prescription />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    );
}

export default App;