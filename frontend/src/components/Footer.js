import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import logo from "../components/assets/veterinary.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section logo">
        <Link to="/"> 
          <img src={logo} alt='Veterinary Clinic Logo' className='footer-logo' />
        </Link>
      </div>
      <div className="footer-section contact">
        <h3>Contact Us</h3>
        <p>Address: 19 Latrobe Street, Melbourne VIC 3000</p>
        <p>Phone: (03) 6783 8383</p>
        <p>Email: contact@vetclinic.com.au</p>
      </div>
      <div className="footer-section hours">
        <h3>Opening Hours</h3>
        <p>Mon - Fri: 8:00am - 6:00pm</p>
        <p>Saturday: 9:00am - 1:00pm</p>
        <p>Sunday: CLOSED</p>
      </div>
      <div className="footer-section social">
        <h3>Follow Us</h3>
        <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="http://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
    </footer>
  );
}

export default Footer;
