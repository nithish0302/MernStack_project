import React, { useState } from "react";
import "../Contact.css";
import Header from "./Header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contact-title">Contact Us</div>
        <div className="contact-subtitle">
          Feel free to reach out to us with any inquiries or concerns!
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <strong>Email:</strong> support@carrental.com
          </div>
          <div className="contact-item">
            <strong>Phone:</strong> +91 8667848953
          </div>
          <div className="contact-item">
            <strong>Address:</strong> 123 Car Rental Street, Coimbatore
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            className="contact-input"
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="contact-input"
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="contact-textarea"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button className="contact-button" type="submit">
            Send Message
          </button>
        </form>

        <iframe
          title="Location"
          className="contact-map"
          src="https://maps.google.com/maps?q=Karpagam%20College%20of%20Engineering,%20Coimbatore&t=&z=15&ie=UTF8&iwloc=&output=embed"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}
