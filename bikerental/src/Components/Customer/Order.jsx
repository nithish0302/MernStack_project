import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../General/Header";
import "../../Order.css";
import axios from "axios";

const Order = () => {
  return (
    <div className="order-page">
      <Header />
      <div className="container">
        <OrderComponent />
      </div>
    </div>
  );
};

function OrderComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(
    location.state?.vehicleData || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    days: "1",
    phone: "",
    pickupDate: "",
    dropDate: "",
    email: "",
    city: "",
    vehicleName: vehicleData?.name || "",
    vehicleType: vehicleData?.type || "",
    pricePerDay: vehicleData?.pricePerDay || "",
    totalPrice: vehicleData?.pricePerDay || "",
  });

  useEffect(() => {
    if (vehicleData?.pricePerDay && formData.pickupDate && formData.dropDate) {
      const pickup = new Date(formData.pickupDate);
      const drop = new Date(formData.dropDate);
      const diffTime = drop.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const total = diffDays * vehicleData.pricePerDay;
      setFormData((prev) => ({
        ...prev,
        days: diffDays.toString(),
        totalPrice: total,
      }));
    }
  }, [formData.pickupDate, formData.dropDate, vehicleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!vehicleData) {
      setError("Please select a valid vehicle first");
      return false;
    }

    if (!formData.pickupDate || !formData.dropDate) {
      setError("Please select both pickup and drop dates");
      return false;
    }

    if (new Date(formData.dropDate) <= new Date(formData.pickupDate)) {
      setError("Drop date must be after pickup date");
      return false;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.city
    ) {
      setError("Please fill all required fields");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        userId: localStorage.getItem("vendorId") || "guest-user",
        vehicleId: vehicleData.id, 
        startDate: formData.pickupDate,
        endDate: formData.dropDate,
        totalAmount: formData.totalPrice,
        bookedName: formData.name, // New field
        bookedEmail: formData.email, // New field
        bookedPhone: formData.phone, // New field
        bookedCity: formData.city, // New field
      };

      const response = await axios.post(
        "http://localhost:8000/api/bookings/create",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Booking successful!");
        navigate("/user/bookings");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="order-container">
      <div className="order-header">
        <h2>Rent {vehicleData ? vehicleData.name : "Your Vehicle"}</h2>
      </div>

      {vehicleData ? (
        <div className="vehicle-display-section">
          <div className="vehicle-details-card">
            <img src={vehicleData.imageUrl} alt={vehicleData.name} />
            <div className="vehicle-info">
              <h3>{vehicleData.name}</h3>
              <div className="specs">
                <p>
                  <span>Type:</span> {vehicleData.type}
                </p>
                <p>
                  <span>Fuel:</span> {vehicleData.fuelType}
                </p>
                <p>
                  <span>Price/Day:</span> ₹{vehicleData.pricePerDay}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-vehicle-warning">
          <p>⚠️ No vehicle selected</p>
          <button onClick={() => navigate("/")} className="browse-vehicles-btn">
            Browse Vehicles
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>Booking Details</h3>
          <div className="input-group">
            <div className="date-input">
              <label>Pickup Date *</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="date-input">
              <label>Drop Date *</label>
              <input
                type="date"
                name="dropDate"
                value={formData.dropDate}
                onChange={handleChange}
                min={
                  formData.pickupDate || new Date().toISOString().split("T")[0]
                }
                required
              />
            </div>
          </div>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City *</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>

        <div className="form-summary">
          <h4>Total Days: {formData.days}</h4>
          <h4>Total Price: ₹{formData.totalPrice}</h4>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default Order;
