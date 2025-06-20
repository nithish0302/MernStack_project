import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../General/Header";
import { CgArrowTopRight } from "react-icons/cg";
import "../../VendorFrontPage.css";
import axios from "axios";
import { FaMotorcycle, FaCar } from "react-icons/fa";

const VendorFrontPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bikeCount, setBikeCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [rentedCount, setRentedCount] = useState(0);
  const vendorId = localStorage.getItem("vendorId");
  const [rentedVehicles, setRentedVehicles] = useState([]);

  useEffect(() => {
    const fetchVendorBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/bookings/vendor/${vendorId}/all`
        );
        const bookings = res.data?.data || [];

        const seen = new Set();
        const uniqueVehicles = [];

        for (const booking of bookings) {
          const vehicle = booking.vehicleId;
          if (vehicle && !seen.has(vehicle._id)) {
            seen.add(vehicle._id);
            uniqueVehicles.push({
              id: vehicle._id,
              name: vehicle.name || "Unnamed Vehicle",
              type: vehicle.type || "unknown",
            });
          }
          if (uniqueVehicles.length >= 10) break;
        }

        setRentedVehicles(uniqueVehicles);
      } catch (err) {
        console.error("Error fetching vendor bookings:", err);
      }
    };

    if (vendorId) {
      fetchVendorBookings();
    }
  }, [vendorId]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/vech/count/${vendorId}`
        );

        const vehicleData = res.data.data || [];
        setVehicles(vehicleData);

        const bikes = vehicleData.filter(
          (v) => v.type.toLowerCase() === "bike"
        );
        const cars = vehicleData.filter((v) => v.type.toLowerCase() === "car");
        const rented = vehicleData.filter((v) => !v.isAvailable);

        setBikeCount(bikes.length);
        setCarCount(cars.length);
        setRentedCount(rented.length);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, [vendorId]);

  const handleAddCar = () => {
    navigate("/addcar");
  };

  const handleAddBike = () => {
    navigate("/addbike");
  };

  const handleNewRequests = () => {
    navigate("/vendor-requests");
  };

  return (
    <div className="Vendortop">
      <Header />
      <div className="Vendorcontainer">
        <div
          className="rentfor"
          onClick={() => {
            navigate("/previousbooking");
          }}
        >
          <h4 className="title-rent">
            Vehicle Rent For
            <span className="arrow">
              <CgArrowTopRight />
            </span>
          </h4>
          <div className="vehicle-listcon">
            {rentedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-item">
                {vehicle.type.toLowerCase() === "bike" ? (
                  <FaMotorcycle className="vehicle-icon" />
                ) : (
                  <FaCar className="vehicle-icon" />
                )}
                <span className="vehicle-name">{vehicle.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="right-container">
          <button className="new-request" onClick={handleNewRequests}>
            New Request
          </button>

          <div className="total-rent-con">
            <p className="total-ren">Total Vehicle Rented: {rentedCount}</p>
            <p className="total-ren">Total Bikes: {bikeCount}</p>
            <p className="total-ren">Total Cars: {carCount}</p>
          </div>

          <button className="new-request" onClick={handleAddCar}>
            Add Car
          </button>
          <br />
          <button
            className="new-request"
            style={{ marginTop: "15px" }}
            onClick={handleAddBike}
          >
            Add Bike
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorFrontPage;
