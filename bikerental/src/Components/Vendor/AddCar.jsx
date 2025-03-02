import React, { useState } from "react";
import Header from "../General/Header";
import "../../AddBike.css"; // Reusing the same CSS file

function AddCar() {
  const [car, setCar] = useState({
    name: "",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: "",
    pricePerDay: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure seats do not exceed 5
    if (name === "seats" && value > 5) {
      return;
    }

    setCar({ ...car, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCar({ ...car, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Car Data Submitted:", car);
    // TODO: Add API call to save car data with image
  };

  return (
    <>
      <Header />
      <div className="AddBikePage">
        <div className="AddBikeContainer">
          <h4 className="AddBikeTitle">Add New Car</h4>
          <form onSubmit={handleSubmit} className="BikeForm">
            <div className="BikeField">
              <label className="BikeLabel">Car Name:</label>
              <input
                type="text"
                name="name"
                value={car.name}
                onChange={handleChange}
                className="BikeInput"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Fuel Type:</label>
              <select
                name="fuelType"
                value={car.fuelType}
                onChange={handleChange}
                className="BikeSelect"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Gear Type:</label>
              <select
                name="gearType"
                value={car.gearType}
                onChange={handleChange}
                className="BikeSelect"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Seats (Max 5):</label>
              <input
                type="number"
                name="seats"
                value={car.seats}
                onChange={handleChange}
                className="BikeInput"
                min="1"
                max="5"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Price Per Day (₹):</label>
              <input
                type="number"
                name="pricePerDay"
                value={car.pricePerDay}
                onChange={handleChange}
                className="BikeInput"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Car Image:</label>
              <div className="BikeFileWrapper">
                <input
                  type="file"
                  className="BikeFileInput"
                  id="carFile"
                  onChange={handleImageChange}
                />
                <label htmlFor="carFile" className="BikeFileLabel">
                  Choose File
                </label>
              </div>
            </div>

            <button type="submit" className="AddBikeButton">
              Add Car
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCar;
