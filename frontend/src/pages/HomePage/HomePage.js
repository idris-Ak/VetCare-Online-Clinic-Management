import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';

import { useState, useEffect } from 'react';


import blog1 from "../../components/assets/blog1.jpg";
import blog2 from  "../../components/assets/blog2.jpg";
import blog3 from  "../../components/assets/blog3.jpg";
import VetCard from '../../components/VetCard/VetCard';
import about1 from  "../../components/assets/about1.jpg";
import about2 from  "../../components/assets/about2.jpg";

import CustomerReviews from "../../components/CustomerReviews";
import "./HomePage.css";


function HomePage({ isLoggedIn }) {
  const [vets, setVets] = useState([]); // This holds the vet data
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/vets`) // Adjust the URL as per your actual backend URL
      .then(response => {
        if (!response.ok) { // Check if response is ok (status in the range 200-299)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVets(data); // Directly set the fetched data to the state assuming it's the array of vets
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  }, []);

  const handleSignUpClick = () => {
    if (isLoggedIn) {
      navigate('/myprofile'); // Redirect to profile page if logged in
    } else {
      navigate('/signup'); // Redirect to signup page if not logged in
    }
  };
  
  return (
    <div>
     
      <div>
        <div className="swiper-container" style={{ marginTop: '0px' }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            <SwiperSlide>
              <div className='display-first-section'>

                <img
                  id="slide-1"
                  src={blog1}
                  alt="Landscape1"
                  style={{ width: '100%', height: '100%' }} // Adjusted style
                />
                <div className="home-content-sec-one">
                  <h2>Book an</h2>
                  <h1>Appointment</h1>
                  <h3>with us today</h3>
                  <Link to="/AppointmentPage/Appointments">
                    <button className="explore-btn">Book Online</button>
                  </Link>
                </div>
              </div>

            </SwiperSlide>

            <SwiperSlide>
              <img
                id="slide-2"
                src={blog2}
                alt="Landscape2"
                style={{ width: '110%', height: '100%', objectFit: 'cover' }}
              />
              <div className="home-content-sec-two">
                <h2>Don't have an account yet?</h2>
                <h1>Sign Up Today</h1>
                <h3>For Free</h3>
                <button className="explore-btn" onClick={handleSignUpClick}>
                  {isLoggedIn ? "Go To Profile" : "Sign Up"}
                </button>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <img
                id="slide-3"
                src={blog3}
                alt="Landscape3"
                style={{ width: '110%', height: '100%', objectFit: 'cover' }}
              />
              <div className="home-content-sec-three">
                <h2>Check out our</h2>
                <h1>extensive</h1>
                <h3>resources page</h3>
                <Link to="/educational">
                  <button className="explore-btn">Learn More</button>
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <h1>About Us</h1>
        <div className="AboutUs">
          <div className="about-images">
            <img src={about1} alt="A friendly dog" className="dog-image" />
            <img src={about2} alt="A serene cat" className="cat-image" />
          </div>
          <div className="about-content">
          
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
        </div>



        <div className="VetTeam">
  <h1>Meet our talented Veterinary Team</h1>
  <div className="vet-team-container">
    {vets.slice(0, 4).map(vet => <VetCard key={vet.id} vet={vet} />)}
  </div>
</div>

<CustomerReviews />


      </div>
    </div>

  );
}

export default HomePage;



