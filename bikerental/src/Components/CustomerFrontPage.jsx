import "../App.css";
import { useState } from "react";
import toyota from "../assets/toyota.jpg";
import benz from "../assets/benz.jpg";
import bmw from "../assets/bmw.svg";
import suzuki from "../assets/suzuki-seeklogo.png";
import audi from "../assets/audi-seeklogo.png";
import { CgArrowTopRight } from "react-icons/cg";
export default function CustomerFrontPage() {
  return (
    <>
      <div className="Customertop">
        <h3 className="textInPage">
          Experience the freedom to go anywhere, anytime, with our affordable,
          reliable, and well-maintained vehicles—your perfect travel companion
          awaits.
        </h3>
        <VehicleSelector />
      </div>
      <h3 className="drive">Drive the Vechile By Your Favourite Brand</h3>
      <br />
      <br />
      <hr />
      <div className="logos">
        <img src={toyota} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={bmw} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={benz} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={suzuki} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={audi} alt="image" className="logo" />
      </div>
      <br />
      <hr style={{ marginBottom: "40px" }} />

      <Vehicle />
    </>
  );
}

function VehicleSelector() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div>
      <label htmlFor="vehicleType" className="sr-only">
        Choose Your Type
      </label>
      <select
        id="vehicleType"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="ChooseYourType"
      >
        <option value="" disabled>
          Choose Your Type
        </option>
        <option value="Bike">Bike</option>
        <option value="Car">Car</option>
      </select>
    </div>
  );
}

const vehiclesData = [
  {
    type: "Bike",
    imageUrl: "https://example.com/bike.jpg",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1500,
  },
  {
    type: "Scooter",
    imageUrl: "https://example.com/scooter.jpg",
    fuelType: "Electric",
    gearType: "Automatic",
    seats: 2,
    pricePerDay: 1550,
  },
  {
    type: "Cruiser Bike",
    imageUrl: "https://example.com/cruiser-bike.jpg",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1600,
  },
  {
    type: "Electric Bike",
    imageUrl: "https://example.com/electric-bike.jpg",
    fuelType: "Electric",
    gearType: "Automatic",
    seats: 2,
    pricePerDay: 1650,
  },
  {
    type: "Hatchback Car",
    imageUrl: "https://example.com/hatchback.jpg",
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 4,
    pricePerDay: 1750,
  },
  {
    type: "Sedan",
    imageUrl: "https://example.com/sedan.jpg",
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 5,
    pricePerDay: 1800,
  },
  {
    type: "SUV",
    imageUrl: "https://example.com/suv.jpg",
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 7,
    pricePerDay: 1900,
  },
  {
    type: "Convertible",
    imageUrl: "https://example.com/convertible.jpg",
    fuelType: "Petrol",
    gearType: "Automatic",
    seats: 4,
    pricePerDay: 1950,
  },
  {
    type: "Pickup Truck",
    imageUrl: "https://example.com/pickup-truck.jpg",
    fuelType: "Diesel",
    gearType: "Manual",
    seats: 5,
    pricePerDay: 2000,
  },
];

function Vehicle() {
  return (
    <div className="vehicle-container">
      {vehiclesData.map((vc, index) => (
        <div key={index} className="vehicle-card">
          <img src={vc.imageUrl} alt={vc.type} className="vehicle-image" />
          <div className="vehicle-content">
            <h3 className="vehicle-title">{vc.type}</h3>
            <hr />
            <div className="vehicle-specs">
              <p>⛽ {vc.fuelType}</p>
              <p>⚙️ {vc.gearType}</p>
              <p>🛋️ {vc.seats} Seats</p>
            </div>
            <hr />
            <div className="vehicle-footer">
              <p className="vehicle-price">Rs {vc.pricePerDay}/day</p>
              <button className="vehicle-button">
                View Details <CgArrowTopRight />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
