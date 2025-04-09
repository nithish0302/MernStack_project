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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", bike.name);
    formData.append("fuelType", bike.fuelType);
    formData.append("gearType", bike.gearType);
    formData.append("seats", bike.seats);
    formData.append("pricePerDay", bike.pricePerDay);
    formData.append("image", bike.image);

    try {
      const response = await fetch("http://localhost:8000/api/bikes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Bike added successfully!");
      } else {
        alert("Error adding bike.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <>
      <Header />
      <div className="AddBikePage">
        <div className="AddBikeContainer">
          <h4 className="AddBikeTitle">Add New Bike</h4>
          <form onSubmit={handleSubmit} className="BikeForm">
            {/* Form fields */}
            {/* Bike Name */}
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

            {/* Fuel Type */}
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

            {/* Gear Type */}
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

            {/* Seats */}
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

            {/* Price per Day */}
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

            {/* Image */}
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

            {/* Submit Button */}
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
