import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import logo from "../assets/veterinary.png";
import Facebook from "../assets/facebook-logo.png";
import Instagram from "../assets/instagram.png"; 
import Twitter from "../assets/twitter.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
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
            <ul className="list-unstyled">
              {/*<a href="https://www.flaticon.com/free-icons/facebook" title="facebook icons">Facebook icons created by Freepik - Flaticon</a>*/}
              <li>  
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={Facebook} url="/https://www.facebook.com" alt="Search" style={{ width: '30px', height: '30px' }} />
              </a> 
              </li>
              {/*<a href="https://www.flaticon.com/free-icons/brands-and-logotypes" title="brands and logotypes icons">Brands and logotypes icons created by Freepik - Flaticon</a>*/}
              <li>  
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={Twitter} url="/https://www.twitter.com" alt="Search" style={{ width: '30px', height: '30px', marginTop: '5px' }} />
              </a> 
              </li>
              {/*<a href="https://www.flaticon.com/free-icons/instagram-logo" title="instagram logo icons">Instagram logo icons created by Freepik - Flaticon</a>*/}
              <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={Instagram} url="/https://www.instagram.com" alt="Search" style={{ width: '30px', height: '30px', marginTop: '5px'}} />
              </a> 
              </li>
        </ul>
      </div>
      </div>

      <div className="footer-copyright">
        <p className="text-center">&copy; {new Date().getFullYear()} VetCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
