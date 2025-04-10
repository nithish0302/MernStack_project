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

  const [errors, setErrors] = useState({
    seats: "",
    pricePerDay: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate seats (must be exactly 2)
    if (name === "seats") {
      const seatValue = parseInt(value);
      if (isNaN(seatValue) || seatValue !== 2) {
        setErrors({ ...errors, seats: "Bikes must have exactly 2 seats" });
        return;
      }
      setErrors({ ...errors, seats: "" });
    }

    // Validate price (must be positive number)
    if (name === "pricePerDay") {
      const priceValue = parseFloat(value);
      if (isNaN(priceValue)) {
        setErrors({ ...errors, pricePerDay: "Please enter a valid number" });
        return;
      }
      if (priceValue <= 0) {
        setErrors({ ...errors, pricePerDay: "Price must be greater than 0" });
        return;
      }
      setErrors({ ...errors, pricePerDay: "" });
    }

    setBike({ ...bike, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file type
    if (!file.type.match("image.*")) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }
    setErrors({ ...errors, image: "" });
    setBike({ ...bike, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const seatValue = parseInt(bike.seats);
    if (isNaN(seatValue)) {
      setErrors({ ...errors, seats: "Please enter a valid number" });
      return;
    }
    if (seatValue !== 2) {
      setErrors({ ...errors, seats: "Bikes must have exactly 2 seats" });
      return;
    }

    const priceValue = parseFloat(bike.pricePerDay);
    if (isNaN(priceValue)) {
      setErrors({ ...errors, pricePerDay: "Please enter a valid number" });
      return;
    }
    if (priceValue <= 0) {
      setErrors({ ...errors, pricePerDay: "Price must be greater than 0" });
      return;
    }

    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }

    if (!bike.image) {
      setErrors({ ...errors, image: "Please upload a bike image" });
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

        // Reset form
        setBike({
          name: "",
          type: "Bike",
          fuelType: "Petrol",
          gearType: "Manual",
          seats: "",
          pricePerDay: "",
          image: null,
        });
        // document.getElementById("bikeFile").value = "";
        setErrors({
          seats: "",
          pricePerDay: "",
          image: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error adding bike: ${errorData.message || "Unknown error"}`);
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
                <option value="Electric">Electric</option>
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
              <label className="BikeLabel">Seats:</label>
              <input
                type="number"
                name="seats"
                value={bike.seats}
                onChange={handleChange}
                className="BikeInput"
                min="2"
                max="2"
                required
              />
              {errors.seats && (
                <span className="error-message">{errors.seats}</span>
              )}
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
                min="1"
                step="0.01"
                required
              />
              {errors.pricePerDay && (
                <span className="error-message">{errors.pricePerDay}</span>
              )}
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
                      accept="image/*"
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
                      type="button"
                      onClick={() => {
                        setBike({ ...bike, image: null });
                        setErrors({ ...errors, image: "" });
                      }}
                      className="RemoveImageBtn"
                      title="Remove Image"
                    >
                      <RxCross2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              {errors.image && (
                <span className="error-message">{errors.image}</span>
              )}
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
