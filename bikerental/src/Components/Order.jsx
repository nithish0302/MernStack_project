import React, { useState } from "react";
import Header from "./Header";
import "../Order.css";
import logo from "../assets/Logo.avif";

const Order = () => {
  return (
    <>
      <div className="image">
        <Header />
        <div className="container order">
          <OrderComponent />
        </div>
      </div>
    </>
  );
};

function OrderComponent() {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [vechilename, setVechilename] = useState("");
  const [vechiletype, setVechiletype] = useState("");

  return (
    <div className="order-container">
      {/* Header */}
      <div className="order-header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Rent the Car</h2>
      </div>

      {/* Form */}
      <div className="order-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone No"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="date"
            placeholder="Pickup Date"
            className="input"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <input
            type="date"
            placeholder="Drop Date"
            className="input"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Vehicle Type"
            className="input"
            value={vechiletype}
            onChange={(e) => setVechiletype(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vehicle Name"
            className="input"
            value={vechilename}
            onChange={(e) => setVechilename(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Price"
            className="input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Days"
            className="input"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>

        <input
          type="email"
          placeholder="Email ID"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          <select
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select Your City</option>
          </select>
        </label>

        <div className="button-container">
          <button className="book-button">Book My Car</button>
        </div>
      </div>
    </div>
  );
}

export default Order;
