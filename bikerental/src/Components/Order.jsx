import React, { useState } from "react";
import Header from "./Header";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "../Order.css";
import logo from "../assets/Logo.avif";

const Order = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Detail />
        <OrderComponent />
      </div>
    </>
  );
};

function OrderComponent() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [day, setDay] = useState("");
  const [price, setPrice] = useState("");
  const [vechilename, setVechilename] = useState("");
  const [vechiletype, setVechiletype] = useState("");

  return (
    <div className="order-container">
      <div className="order-header">
        <img src={logo} alt="Car Rental Logo" className="logo" />
        <h2>Rent the Car</h2>
      </div>
      <div className="order-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone No"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="date"
            placeholder="Pickup Date"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <input
            type="date"
            placeholder="Drop Date"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Vechile Type"
            value={vechiletype}
            onChange={(e) => setVechiletype(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vechile Name"
            value={vechilename}
            onChange={(e) => setVechilename(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Days"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email con"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="select"
        >
          <option value="">Select Your City</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>
        <div className="button-container">
          <button className="book-button">Book My Car</button>
        </div>
      </div>
    </div>
  );
}

export default Order;
function Detail() {
  return (
    <>
      {" "}
      <div>
        <h4>Santised Car at YourDoorStep</h4>
        <div>
          <IoMdCheckmarkCircleOutline />
          <p>Budget-Friendly Car</p>
        </div>
        <div>
          <IoMdCheckmarkCircleOutline />
          <p>Doorstep Car Delivery</p>
        </div>
        <div>
          <IoMdCheckmarkCircleOutline />
          <p>Any Brands and Models</p>
        </div>
        <div>
          <IoMdCheckmarkCircleOutline />
          <p>Unlimited Kilometers</p>
        </div>
        <div>
          <IoMdCheckmarkCircleOutline />
          <p>Sedan, Hatchback, SUV</p>
        </div>
      </div>
    </>
  );
}
