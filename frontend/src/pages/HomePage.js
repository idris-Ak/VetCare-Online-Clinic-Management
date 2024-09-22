import React from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';

import blog1 from '../components/assets/blog1.jpg';
import blog2 from '../components/assets/blog2.jpg';
import blog3 from '../components/assets/blog3.jpg';
import VetCard from '../components/VetCard';
import vets from '../components/data/vets';
import about1 from "../components/assets/about1.jpg";
import about2 from "../components/assets/about2.jpg";

import CustomerReviews from "../components/CustomerReviews";
import "./HomePage.css";

function HomePage() {
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
                  <h2>content</h2>
                  <h1>content</h1>
                  <h3>content</h3>
                  <Link to="/">
                    <button className="explore-btn">content</button>
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
              <div className="home-content-sec-one">
                <h2>content</h2>
                <h1>content</h1>
                <h3>content</h3>
                <Link to="/">
                  <button className="explore-btn">content</button>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <img
                id="slide-3"
                src={blog3}
                alt="Landscape3"
                style={{ width: '110%', height: '100%', objectFit: 'cover' }}
              />
              <div className="home-content-sec-one">
                <h2>content</h2>
                <h1>content</h1>
                <h3>content</h3>
                <Link to="/">
                  <button className="explore-btn">content</button>
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



