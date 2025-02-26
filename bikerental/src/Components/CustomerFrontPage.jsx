import "../App.css";
import { useState } from "react";
import image from "../assets/imageindex.js";
import { CgArrowTopRight } from "react-icons/cg";
import Header from "./Header.jsx";
export default function CustomerFrontPage() {
  return (
    <>
      <div className="Customertop">
        <Header />
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
        <img src={image.image1} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={image.image3} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={image.image2} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={image.image14} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={image.image13} alt="image" className="logo" />
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
    type: "Z900",
    imageUrl: image.image12,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1500,
  },
  {
    type: "BMW 1000 RR",
    imageUrl: image.image4,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1550,
  },
  {
    type: "Duke",
    imageUrl: image.image6,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1600,
  },
  {
    type: "HarleyDavison",
    imageUrl: image.image7,
    fuelType: "Petrol",
    gearType: "Manula",
    seats: 2,
    pricePerDay: 1650,
  },
  {
    type: "Hunter350",
    imageUrl: image.image8,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 4,
    pricePerDay: 1750,
  },
  {
    type: "Nissan Qashqai",
    imageUrl: image.image9,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 5,
    pricePerDay: 1800,
  },
  {
    type: "Range Rover Velar",
    imageUrl: image.image10,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 7,
    pricePerDay: 1900,
  },
  {
    type: "BMW M8 Competition",
    imageUrl: image.image5,
    fuelType: "Petrol",
    gearType: "Automatic",
    seats: 4,
    pricePerDay: 1950,
  },
  {
    type: "Swift",
    imageUrl: image.image11,
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
