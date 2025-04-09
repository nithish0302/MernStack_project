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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", car.name);
    formData.append("fuelType", car.fuelType);
    formData.append("gearType", car.gearType);
    formData.append("seats", car.seats);
    formData.append("pricePerDay", car.pricePerDay);
    if (car.image) {
      formData.append("image", car.image);
    }

    try {
      const response = await fetch("http://localhost:8000/api/bikes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Car added successfully!");

        // Reset form
        setCar({
          name: "",
          fuelType: "Petrol",
          gearType: "Manual",
          seats: "",
          pricePerDay: "",
          image: null,
        });

        // Optional: Reset file input manually
        document.getElementById("carFile").value = "";
      } else {
        alert(`Failed to add car: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting car:", error);
      alert("Something went wrong. Please try again.");
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
