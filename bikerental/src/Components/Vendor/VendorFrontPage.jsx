import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../General/Header";
import { CgArrowTopRight } from "react-icons/cg";
import "../../VendorFrontPage.css";
import axios from "axios";

const VendorFrontPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bikeCount, setBikeCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/vech/count/${vendorId}`
        );

        const data = res.data;
        setVehicles(data);

        const bikes = data.filter((v) => v.type.toLowerCase() === "bike");
        const cars = data.filter((v) => v.type.toLowerCase() === "car");

        setBikeCount(bikes.length);
        setCarCount(cars.length);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddCar = () => {
    navigate("/addcar");
  };

  const handleAddBike = () => {
    navigate("/addbike");
  };

  return (
    <div className="Vendortop">
      <Header />
      <div className="Vendorcontainer">
        <div className="rentfor">
          <h4 className="title-rent">
            Vehicle Rent For
            <span className="arrow">
              <CgArrowTopRight />
            </span>
          </h4>
          {/* Left side container - empty for now */}
          <div className="vehicle-listcon"></div>
        </div>

        <div className="right-container">
          <button className="new-request">New Request</button>

          <div className="total-rent-con">
            <p className="total-ren">Total Vehicle Rented: 0</p>
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
