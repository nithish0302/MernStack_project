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
    pricePerKm: "",
    image: null,
    vehicleNumber: "",
  });

  const [errors, setErrors] = useState({
    seats: "",
    pricePerKm: "",
    image: "",
    vehicleNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "seats") {
      const seatValue = parseInt(value);
      if (isNaN(seatValue) || seatValue !== 2) {
        setErrors({ ...errors, seats: "Bikes must have exactly 2 seats" });
        return;
      }
      setErrors({ ...errors, seats: "" });
    }

    if (name === "pricePerKm") {
      const priceValue = parseFloat(value);
      if (isNaN(priceValue)) {
        setErrors({ ...errors, pricePerKm: "Please enter a valid number" });
        return;
      }
      if (priceValue <= 0) {
        setErrors({ ...errors, pricePerKm: "Price must be greater than 0" });
        return;
      }
      setErrors({ ...errors, pricePerKm: "" });
    }

    setBike({ ...bike, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }
    setErrors({ ...errors, image: "" });
    setBike({ ...bike, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seatValue = parseInt(bike.seats);
    if (isNaN(seatValue)) {
      setErrors({ ...errors, seats: "Please enter a valid number" });
      return;
    }
    if (seatValue !== 2) {
      setErrors({ ...errors, seats: "Bikes must have exactly 2 seats" });
      return;
    }

    const priceValue = parseFloat(bike.pricePerKm);
    if (isNaN(priceValue)) {
      setErrors({ ...errors, pricePerKm: "Please enter a valid number" });
      return;
    }
    if (priceValue <= 0) {
      setErrors({ ...errors, pricePerKm: "Price must be greater than 0" });
      return;
    }

    const tnRegex = /^TN\s?\d{2}\s+[A-Z]{1,2}\s+\d{4}$/i;
    if (!tnRegex.test(bike.vehicleNumber)) {
      setErrors({
        ...errors,
        vehicleNumber: "Invalid TN vehicle number format",
      });
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
    formData.append("pricePerKm", bike.pricePerKm);
    formData.append("image", bike.image);
    formData.append("vendor", vendorId);
    formData.append("vehicleNumber", bike.vehicleNumber);

    try {
      const response = await fetch("http://localhost:8000/api/vech/", {
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
          pricePerKm: "",
          image: null,
          vehicleNumber: "",
        });
        setErrors({
          seats: "",
          pricePerKm: "",
          image: "",
          vehicleNumber: "",
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
              <label className="BikeLabel">Vehicle Number:</label>
              <input
                type="text"
                name="vehicleNumber"
                value={bike.vehicleNumber}
                onChange={handleChange}
                className="BikeInput"
                placeholder="e.g., TN 22 AB 1234"
                required
              />
              {errors.vehicleNumber && (
                <span className="error-message">{errors.vehicleNumber}</span>
              )}
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
                <option value="Electric">Electric</option>
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
                min="2"
                max="2"
                required
              />
              {errors.seats && (
                <span className="error-message">{errors.seats}</span>
              )}
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Price Per Km (₹):</label>
              <input
                type="number"
                name="pricePerKm"
                value={bike.pricePerKm}
                onChange={handleChange}
                className="BikeInput"
                min="1"
                step="0.01"
                required
              />
              {errors.pricePerKm && (
                <span className="error-message">{errors.pricePerKm}</span>
              )}
            </div>

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
