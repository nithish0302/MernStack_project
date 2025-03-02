import React, { useState } from "react";
import Header from "../General/Header";
import "../../AddBike.css";

function AddBike() {
  const [bike, setBike] = useState({
    name: "",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: "",
    pricePerDay: "",
    image: null,
  });

  const handleChange = (e) => {
    setBike({ ...bike, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBike({ ...bike, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bike Data Submitted:", bike);
    // TODO: Add API call to save bike data with image
  };

  return (
    <>
      <Header />
      <div className="AddBikePage">
        <div className="AddBikeContainer">
          <h4 className="AddBikeTitle">Add New Bike</h4>
          <form onSubmit={handleSubmit} className="BikeForm">
            <div className="BikeField">
              <label className="BikeLabel">Bike Name:</label>
              <input
                type="text"
                name="name"
                value={bike.name}
                onChange={handleChange}
                className="BikeInput"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Fuel Type:</label>
              <select
                name="fuelType"
                value={bike.fuelType}
                onChange={handleChange}
                className="BikeSelect"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Gear Type:</label>
              <select
                name="gearType"
                value={bike.gearType}
                onChange={handleChange}
                className="BikeSelect"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Seats:</label>
              <input
                type="number"
                name="seats"
                value={bike.seats}
                onChange={handleChange}
                className="BikeInput"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Price Per Day (₹):</label>
              <input
                type="number"
                name="pricePerDay"
                value={bike.pricePerDay}
                onChange={handleChange}
                className="BikeInput"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Bike Image:</label>
              <div class="BikeFileWrapper">
                <input type="file" class="BikeFileInput" id="bikeFile" />
                <label for="bikeFile" class="BikeFileLabel">
                  Choose File
                </label>
              </div>
            </div>

            <button type="submit" className="AddBikeButton">
              Add Bike
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBike;
