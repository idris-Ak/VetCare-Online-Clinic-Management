import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import "./CustomerReviews.css";

const CustomerReviews = () => (
  <div className="customer-reviews-container">
    <h1>Hear From Our Happy Clients!</h1>
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{
        clickable: true,
        renderBullet: (index, className) => {
            return `<span class="${className}"></span>`;
        }
      }}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      spaceBetween={30}
      slidesPerView={1}
    >
      <SwiperSlide>
        <div className="review-card">
          <p>"I've used several online vet services before, but VetCare has taken the hassle out of scheduling appointments! The booking process is straightforward and quick. I could easily select a time that worked for both me and my pet, and the confirmation was instant. No more phone calls and waiting times. It's a game-changer for busy pet owners!"</p>
          <div className="reviewer">— Jane Doe</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="review-card">
          <p>"Getting prescription refills through VetCare has been a breeze! After our consultation, I was able to order the necessary medications for my cat directly through their platform. The medications were delivered to my door within a couple of days. This feature is not only convenient but also ensures that we never run out of the essentials."</p>
          <div className="reviewer">— John Smith</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="review-card">
          <p>"One of the biggest advantages of using VetCare is having all of my dog's medical records in one place, accessible online anytime. It's incredibly reassuring to know that I can pull up any past visit details, vaccination records, or lab results whenever needed, especially in emergencies. This feature has made managing my dog's health care so much easier."</p>
          <div className="reviewer">— Emily White</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="review-card">
          <p>"The online blog resources have been a godsend for us new pet parents. The articles are not only informative but very easy to understand, covering topics from basic training techniques to advanced health issues. It feels like having a vet on call 24/7!"</p>
          <div className="reviewer">— Michael Brown</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="review-card">
          <p>"The user interface for accessing and updating our pets' medical records is the best I've seen. Super intuitive and user-friendly. I can book appointments without any hassle and get reminders so I never forget a session. It's been a huge relief during our busy schedule."</p>
          <div className="reviewer">— Sarah Connor</div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
);

export default CustomerReviews;
