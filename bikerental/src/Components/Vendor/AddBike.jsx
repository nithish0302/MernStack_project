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
    const { name, value } = e.target;

    // Ensure seats do not exceed 2
    if (name === "seats" && value > 2) {
      return;
    }

    setBike({ ...bike, [name]: value });
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
                <option value="Diesel">Electric</option>
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
              <label className="BikeLabel">Seats (Max 2):</label>
              <input
                type="number"
                name="seats"
                value={bike.seats}
                onChange={handleChange}
                className="BikeInput"
                min="1"
                max="2"
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
              <div className="BikeFileWrapper">
                <input
                  type="file"
                  className="BikeFileInput"
                  id="bikeFile"
                  onChange={handleImageChange}
                />
                <label htmlFor="bikeFile" className="BikeFileLabel">
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
