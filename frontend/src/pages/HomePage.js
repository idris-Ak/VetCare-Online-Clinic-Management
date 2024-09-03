
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./HomePage.css";
function HomePage() {
  return (
    <div>
      <Navbar />


      <h1>Welcome to My React App</h1>
      <p>This is a basic home page.</p>

      <div className='Research'>
      <h1> Research </h1>
      <p> Have a read through our extensive range of blogs</p>
      </div>




      <h1> About Us</h1>
      
      <div className='AboutUs'>
  <p>
    At VetCare, our mission is to enhance the well-being of pets and ease the responsibilities of their owners through our innovative Online Vet Clinic Management System. 
    Founded by a team of dedicated veterinary professionals and tech enthusiasts, we blend cutting-edge technology with deep veterinary expertise to bring you a comprehensive, 
    user-friendly solution for managing your pet's health. Our team understands the special bond between pets and their families. 
    That's why we've designed VetCare to be as compassionate and reliable as the care you wish for your furry friends. 
    With a robust network of veterinary clinics and pet care stores, we ensure that our users have the best options right at their fingertips.
  </p>
  <p>
    We are passionate about animals and committed to providing accurate, up-to-date information to keep your pet healthy and happy. 
    From scheduling appointments to managing medical records, and from prescription refills to accessing educational content, 
    VetCare is here to support every step of your pet care journey. Whether you are at home or on the go, VetCare ensures that expert advice and quality care are never out of reach. 
    Join us in making pet care effortless and effective, with all the tools you need just a click away. Together, let's nurture the health and happiness of our beloved pets.
  </p>
</div>

<Footer />
    </div>
  );
}

export default HomePage;
