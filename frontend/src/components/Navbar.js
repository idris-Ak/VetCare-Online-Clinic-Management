import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profilepic from '../components/assets/profilepic.png';
import './Navbar.css'; // Import the CSS file for styling

function Navbar({ logoutUser, isLoggedIn, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleProtectedClick = (e, link) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('Please log in to access this page.');
    } else {
      navigate(link);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list main-links">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>

        <li className="navbar-item">
          <Link to="/AppointmentPage/Appointments" className="navbar-link" onClick={(e) => handleProtectedClick(e, '/AppointmentPage/Appointments')}>
            Book Online
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/MedicalRecords" className="navbar-link" onClick={(e) => handleProtectedClick(e, '/MedicalRecords')}>
            Medical Records
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/prescription" className="navbar-link" onClick={(e) => handleProtectedClick(e, '/prescription')}>
            Prescription
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/educational" className="navbar-link">Educational Resources</Link>
        </li>
      </ul>

      <ul className="navbar-list user-links">
        {isLoggedIn ? (
          <li className="navbar-item">
            <Link to="/myprofile" className="navbar-link">
              <img src={profilepic} alt="Profile" style={{ width: '28px', height: '28px' }} />
            </Link>
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        ) : (
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
