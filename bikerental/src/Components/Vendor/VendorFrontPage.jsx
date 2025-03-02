import React from "react";
import Header from "../General/Header";
import { CgArrowTopRight } from "react-icons/cg";
import "../../VendorFrontPage.css";

const VendorFrontPage = () => {
  const vehiclesData = [
    {
      name: "Z900",
      type: "Bike",
      fuelType: "Petrol",
      gearType: "Manual",
      seats: 2,
      pricePerDay: 1500,
    },
    {
      name: "BMW 1000 RR",
      type: "Bike",
      fuelType: "Petrol",
      gearType: "Manual",
      seats: 2,
      pricePerDay: 1550,
    },
    {
      name: "Duke",
      type: "Bike",
      fuelType: "Petrol",
      gearType: "Manual",
      seats: 2,
      pricePerDay: 1600,
    },
    {
      name: "Harley Davidson",
      type: "Bike",
      fuelType: "Petrol",
      gearType: "Manual",
      seats: 2,
      pricePerDay: 1650,
    },
    {
      name: "Hunter 350",
      type: "Bike",
      fuelType: "Petrol",
      gearType: "Manual",
      seats: 4,
      pricePerDay: 1750,
    },
    {
      name: "Nissan Qashqai",
      type: "Car",
      fuelType: "Diesel",
      gearType: "Automatic",
      seats: 5,
      pricePerDay: 1800,
    },
    {
      name: "Range Rover Velar",
      type: "Car",
      fuelType: "Diesel",
      gearType: "Automatic",
      seats: 7,
      pricePerDay: 1900,
    },
    {
      name: "BMW M8 Competition",
      type: "Car",
      fuelType: "Petrol",
      gearType: "Automatic",
      seats: 4,
      pricePerDay: 1950,
    },
    {
      name: "Swift",
      type: "Car",
      fuelType: "Diesel",
      gearType: "Manual",
      seats: 5,
      pricePerDay: 2000,
    },
  ];

  return (
    <>
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

            <div className="vehicle-listcon">
              {vehiclesData.map((vc, index) => (
                <div key={index}>
                  {/* Uncomment this when you add the image */}
                  {/* <img src={vc.imageUrl} alt={vc.name} className="vehicle-image" /> */}
                  <p className="vehicle-namecon">{vc.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="right-container">
            <button className="new-request">New Request</button>

            <div className="total-rent-con">
              <p className="total-ren">Total Vehicle Rent :</p>
              <p className="total-ren">Total Bikes :</p>
              <p className="total-ren">Total Cars:</p>
            </div>

            <button className="new-request">Add Car</button>
            <br />
            <button className="new-request" style={{ marginTop: "15px" }}>
              Add Bike
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorFrontPage;
