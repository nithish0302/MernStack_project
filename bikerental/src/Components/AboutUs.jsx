import React from "react";
import "../AboutUs.css";
import Header from "./Header";

export default function AboutUs() {
  return (
    <>
      <Header />
      <div className="about-container">
        <div className="about-title">About Us</div>
        <div className="about-subtitle">
          Your Trusted Car & Bike Rental Service in Coimbatore
        </div>

        <div className="about-content">
          <p className="about-text">
            Welcome to our vehicle rental service! We are dedicated to providing
            high-quality rental cars and bikes at affordable prices. Our goal is
            to make your travel experience smooth and convenient.
          </p>

          <p className="about-text">
            Whether you need a vehicle for a business trip, vacation, or daily
            use, we have a range of options to suit your needs. With easy online
            booking, 24/7 support, and well-maintained vehicles, we ensure a
            hassle-free rental experience.
          </p>

          <p className="about-text">
            Our team is passionate about delivering excellent customer service
            and ensuring you have the best rental experience possible. Choose us
            for reliability, quality, and customer satisfaction!
          </p>
        </div>

        <div className="about-mission">
          <div className="about-mission-title">Our Mission</div>
          <p className="about-mission-text">
            To offer safe, reliable, and affordable vehicle rental services with
            a focus on customer satisfaction and sustainability.
          </p>
        </div>

        <div className="about-image">
          <img
            className="about-img"
            src="https://source.unsplash.com/800x400/?car,bike"
            alt="Car and Bike Rental"
          />
        </div>
      </div>
    </>
  );
}
