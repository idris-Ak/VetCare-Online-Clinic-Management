import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import profilepic from '../components/assets/profilepic.png';
import './Navbar.css'; // Import the CSS file for styling
import logo from "../components/assets/veterinary.png";

function Navbar({ logoutUser, isLoggedIn, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
    logoutUser();
    navigate('/login');
    }
  };

  const handleNavigation= (link) => {
    if (!isLoggedIn) {
      //Navigate to the login page with the intended destination as state
      navigate('/login', { state: { from: link } });
    } else {
      navigate(link);
    }
  };

  // function to get the profile picture URL
  const getProfilePicUrl = () => {
    // If user has a profile picture, check if it's Base64 and add prefix if needed
    if (user && user.profilePicture) {
      // If it's Base64, add the necessary prefix
      return `data:image/jpeg;base64,${user.profilePicture}`;
    }
    return profilepic;
  };

  return (
    <nav className="navbar">
      <Link to="/"> 
      <img src={logo} alt='Veterinary Logo' className='navbar-logo' />
      </Link>
      <ul className="navbar-list main-links">
        <li className="navbar-item">
        <NavLink to="/" className="navbar-link" activeClassName="active">Home</NavLink>
        </li>

        <li className="navbar-item">
          <NavLink to="/AppointmentPage/Appointments" className="navbar-link" onClick={()=> handleNavigation('/AppointmentPage/Appointments')}>
            Book Online
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink to="/MedicalRecords" className="navbar-link" onClick={() => handleNavigation('/MedicalRecords')}>
            Medical Records
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink to="/prescription" className="navbar-link" onClick={() => handleNavigation('/prescription')}>
            Prescription
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink to="/educational" className="navbar-link">Educational Resources</NavLink>
        </li>
      </ul>

      <ul className="navbar-list user-links">
        {isLoggedIn && user ? (
          <li className="navbar-item">
          <span className="welcome-text">Welcome, {user.role === 'Vet' ? (
          <span>
          <span style={{ color: '#007bff', fontStyle: 'italic', marginLeft: '5px'}}>Dr. </span>{user.name}
          </span>
          ) : user.name} 
          </span>
            <Link to="/myprofile" className="navbar-link">
            {/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Becris - Flaticon</a> */}
              <img 
                src={getProfilePicUrl()}
                alt="Profile"
                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '50%' }}
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
