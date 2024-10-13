import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import profilepic from '../assets/profilepic.png';
import './Navbar.css'; // Import the CSS file for styling
import logo from "../assets/veterinary.png";
import { Modal, Button } from 'react-bootstrap';

function Navbar({ logoutUser, isLoggedIn, user }) {
  const navigate = useNavigate();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    // Handle showing the modal
  const handleShowLogoutModal = () => setShowLogoutMessage(true);
  const handleCloseLogoutModal = () => setShowLogoutMessage(false);

  const handleLogout = () => {
    setShowLogoutMessage(false);
    logoutUser();
    navigate('/login');
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/"> 
        <img src={logo} alt='Veterinary Logo' className='navbar-logo' />
      </Link>
      {/*Implement navbar toggler if user has smaller screen*/}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{ borderColor: 'rgba(255,255,255,.5)' }}>
        <span className="navbar-toggler-icon" style={{ color: '#fff' }}></span>
        </button>
    <div className="collapse navbar-collapse" style={{fontWeight: 'bold'}} id="navbarSupportedContent">
      <ul className="navbar-list main-links">
        {/* Conditional Rendering Based on User Role */}
        {isLoggedIn && user && user.role === 'Vet' ? (
            <>
              {/* Vets can only see the Vet Dashboard */}
                <div className="navbar-center">
                  <li className="navbar-item">
                <NavLink to="/VetDashboard" className="navbar-link" onClick={() => handleNavigation('/VetDashboard')}>
                  Vet Dashboard
                </NavLink>
                   </li>
                </div>
            </>
          ) : (
            <>
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
        </>
        )}
      </ul>

      <ul className="navbar-list user-links ms-auto">
        {isLoggedIn && user ? (
          <li className="navbar-item">
          <span className="welcome-text">Welcome, {user.name} </span>
            <Link to="/myprofile" className="navbar-link">
            {/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Becris - Flaticon</a> */}
              <img 
                src={getProfilePicUrl()}
                alt="Profile"
                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </Link>
            <button onClick={handleShowLogoutModal} className="logout-button" style={{fontWeight: 'bold'}}>Logout</button>
          </li>
        ) : (
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">Login</Link>
          </li>
        )}
      </ul>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutMessage} onHide={handleCloseLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    </nav>
  );
}

export default Navbar;