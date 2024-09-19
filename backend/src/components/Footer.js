/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section logo">
        <img src="path_to_logo.png" alt="Logo Image Placeholder" />
      </div>
      <div className="footer-section contact">
        <h3>Contact Us:</h3>
        <p>Address: 19 Latrob Street 3000</p>
        <p>03 6783 83843 </p>
        <p>Goup02@class06.com.au</p>
      </div>
      <div className="footer-section hours">
        <h3>Opening Hours:</h3>
        <p>Monday: 8:00am - 6:00pm</p>
        <p>Tuesday: 8:00am - 6:00pm</p>
        <p>Wednesday: 8:00am - 6:00pm</p>
        <p>Thursday: 8:00am - 6:00pm</p>
        <p>Friday: 8:00am - 6:00pm</p>
        <p>Saturday: 9:00am - 1:00pm</p>
        <p>Sunday: CLOSED</p>
      </div>
    </footer>
  );
}

export default Footer;
