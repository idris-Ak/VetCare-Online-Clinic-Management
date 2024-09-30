import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Imported Navigate for redirect
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import vets from './components/data/vets';
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

// Fetch user details by userId
async function fetchUserDetails(userId) {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null; // If user is not found or request fails, return null
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isLoggedIn')));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [user, setUser] = useState(null);


    // Fetch the user details when the userId is present in localStorage
    useEffect(() => {
    if (userId) {
    fetchUserDetails(userId).then(fetchedUser => {
      if (fetchedUser) {
        setUser(fetchedUser);
      }
      });
    }
  }, [userId]);


    const loginUser = (userData) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userData.id); // Only store userId in local storage
      setIsLoggedIn(true); 
      setUserId(userData.id);
      setUser(userData);  
    };

    const logoutUser = async () => {
      localStorage.removeItem('userId');
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
                  <Appointments user={user} />
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