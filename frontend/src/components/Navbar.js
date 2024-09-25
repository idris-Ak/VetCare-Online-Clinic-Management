import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import profilepic from '../components/assets/profilepic.png';
import './Navbar.css'; // Import the CSS file for styling

function Navbar({ logoutUser, isLoggedIn, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
    logoutUser();
    navigate('/login');
    }
  };

  const handleNavigation= (link) => {
    console.log('Navigating to:', link);
    if (!isLoggedIn) {
      //Navigate to the login page with the intended destination as state
      navigate('/login', { state: { from: link } });
    } else {
      navigate(link);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list main-links">
        <li className="navbar-item">
        <NavLink to="/" className="navbar-link" activeClassName="active">Home</NavLink>
        </li>

        <li className="navbar-item">
          <Link to="/AppointmentPage/Appointments" className="navbar-link" onClick={()=> handleNavigation('/AppointmentPage/Appointments')}>
            Book Online
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/MedicalRecords" className="navbar-link" onClick={() => handleNavigation('/MedicalRecords')}>
            Medical Records
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/prescription" className="navbar-link" onClick={() => handleNavigation('/prescription')}>
            Prescription
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/educational" className="navbar-link">Educational Resources</Link>
        </li>
      </ul>

      <ul className="navbar-list user-links">
        {isLoggedIn && user ? (
          <li className="navbar-item">
            <span className="welcome-text">Welcome, {user.name}</span>
            <Link to="/myprofile" className="navbar-link">
            {/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Becris - Flaticon</a> */}
              <img 
                src={user && user.profilePicture ? user.profilePicture : profilepic}
                alt="Profile"
                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
              />
            </Link>
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
