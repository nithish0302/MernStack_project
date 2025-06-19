import React, { useState } from "react";
import Header from "../General/Header";
import "../../AddBike.css";
import { RxCross2 } from "react-icons/rx";

function AddCar() {
  const [car, setCar] = useState({
    name: "",
    type: "Car",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: "",
    pricePerKm: "",
    image: null,
    vehicleNumber: "",
    isAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "seats") {
      const seatValue = parseInt(value);
      if (isNaN(seatValue)) {
        alert("Please enter a valid number for seats");
        return;
      }
      if (seatValue < 2 || seatValue > 5) {
        alert("Seats must be between 2 and 5 (inclusive)");
        return;
      }
    }

    setCar({ ...car, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCar({ ...car, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seatValue = parseInt(car.seats);
    if (seatValue < 2 || seatValue > 5) {
      alert("Seats must be between 2 and 5 (inclusive)");
      return;
    }

    const tnRegex = /^TN\s?\d{2}\s+[A-Z]{1,2}\s+\d{4}$/i;
    if (!tnRegex.test(car.vehicleNumber)) {
      alert("Invalid TN vehicle number format (e.g. TN 22 AB 1234)");
      return;
    }

    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }

    if (!car.image) {
      alert("Please upload a car image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", car.name);
    formData.append("type", car.type);
    formData.append("fuelType", car.fuelType);
    formData.append("gearType", car.gearType);
    formData.append("seats", car.seats);
    formData.append("pricePerKm", car.pricePerKm);
    formData.append("vehicleNumber", car.vehicleNumber);
    formData.append("image", car.image);
    formData.append("vendor", vendorId);
    formData.append("isAvailable", car.isAvailable);

    try {
      const response = await fetch("http://localhost:8000/api/vech/cars", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Car added successfully!");
        setCar({
          name: "",
          type: "Car",
          fuelType: "Petrol",
          gearType: "Manual",
          seats: "",
          pricePerKm: "",
          image: null,
          vehicleNumber: "",
          isAvailable: true,
        });
      } else {
        const errorData = await response.json();
        alert(`Error adding car: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to add car. Please try again.");
    }
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
              <label className="BikeLabel">Vehicle Number:</label>
              <input
                type="text"
                name="vehicleNumber"
                value={car.vehicleNumber}
                onChange={handleChange}
                className="BikeInput"
                placeholder="e.g., TN 22 AB 1234"
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
              <label className="BikeLabel">Seats (2-5):</label>
              <input
                type="number"
                name="seats"
                value={car.seats}
                onChange={handleChange}
                className="BikeInput"
                min="2"
                max="5"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Price Per Km (₹):</label>
              <input
                type="number"
                name="pricePerKm"
                value={car.pricePerKm}
                onChange={handleChange}
                className="BikeInput"
                min="1"
                required
              />
            </div>

            <div className="BikeField">
              <label className="BikeLabel">Car Image:</label>
              <div className="BikeFileWrapper">
                {!car.image ? (
                  <>
                    <input
                      type="file"
                      className="BikeFileInput"
                      id="carFile"
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                    />
                    <label htmlFor="carFile" className="BikeFileLabel">
                      Choose File
                    </label>
                  </>
                ) : (
                  <div className="SelectedFileInfo">
                    <span>Selected File: {car.image.name}</span>
                    <button
                      onClick={() => setCar({ ...car, image: null })}
                      className="RemoveImageBtn"
                      title="Remove Image"
                    >
                      <RxCross2 size={18} />
                    </button>
                  </div>
                )}
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
