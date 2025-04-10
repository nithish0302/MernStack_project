import React, { useState } from "react";
import Header from "../General/Header";
import "../../AddBike.css";
import { RxCross2 } from "react-icons/rx";
function AddBike() {
  const [bike, setBike] = useState({
    name: "",
    type: "Bike",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: "",
    pricePerDay: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "seats" && value != 2) {
      alert("Check the seat it from 2 ");
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
    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }
    if (!bike.image) {
      alert("Please upload a bike image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", bike.name);
    formData.append("type", bike.type);
    formData.append("fuelType", bike.fuelType);
    formData.append("gearType", bike.gearType);
    formData.append("seats", bike.seats);
    formData.append("pricePerDay", bike.pricePerDay);
    formData.append("image", bike.image);
    formData.append("vendor", vendorId);
    try {
      const response = await fetch("http://localhost:8000/api/vech/bikes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Bike added successfully!");

        setBike({
          name: "",
          type: "Bike",
          fuelType: "Petrol",
          gearType: "Manual",
          seats: "",
          pricePerDay: "",
          image: null,
        });
        document.getElementById("carFile").value = "";
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Error adding bike: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting Bike:", error);
      alert("Something went wrong. Please try again later.");
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
                {!bike.image ? (
                  <>
                    <input
                      type="file"
                      className="BikeFileInput"
                      id="bikeFile"
                      onChange={handleImageChange}
                      required
                    />
                    <label htmlFor="bikeFile" className="BikeFileLabel">
                      Choose File
                    </label>
                  </>
                ) : (
                  <div className="SelectedFileInfo">
                    <span>Selected File: {bike.image.name}</span>
                    <button
                      onClick={() => setBike({ ...bike, image: null })}
                      className="RemoveImageBtn"
                      title="Remove Image"
                    >
                      <RxCross2 size={18} />
                    </button>
                  </div>
                )}
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
