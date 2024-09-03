// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Import the CSS file for styling

function Navbar({logoutUser, isLoggedIn}) {
     const navigate = useNavigate();

     const handleLogout = () => {
      logoutUser();
      navigate('/login');
    };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/about" className="navbar-link">About</Link>
        </li>
        <li className="navbar-item">
          <Link to="/contact" className="navbar-link">Contact</Link>
        </li>
        <li className="navbar-item">
          <Link to="/VetCareDashboard" className="navbar-link">VetCare Dashboard</Link>
        </li>
        {isLoggedIn ? (
            <>
            {/*<a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>*/}
            <Link className="nav-link act me-2" to="/myprofile" style={{marginRight: '20px'}}>
              <img src="/user.png" alt="Profile" style={{ width: '28px', height: '28px'}} />
            </Link>
            <span className="welcome-text" style={{ marginRight: '20px' }}>Welcome, </span>
             <button onClick={handleLogout} className="logout-button" style={{background: 'none', border: 'none'}}>Logout</button>
              </>
          ) : (
            <>
              {/*<a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>*/}
              <Link className="nav-link act" to="/login" style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginRight: '30px' }}>
                <img src="/user.png" alt="Login" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <span style={{ marginLeft: '10px', color: 'white' }}>Login</span>
              </Link>
            </>
          )}
      </ul>
    </nav>
  );
}

export default Navbar;
