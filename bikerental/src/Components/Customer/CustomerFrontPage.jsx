import "../../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../General/Header.jsx";
import image from "../../assets/imageindex.js";
import VehicleCardComponent from "../General/VechileCardComponenet.jsx";

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
      <h3 className="drive">Drive the Vehicle By Your Favourite Brand</h3>
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
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelection = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value === "Bike") {
      navigate("/BikePage");
    } else if (value === "Car") {
      navigate("/CarPage");
    }
  };

  return (
    <div>
      <label htmlFor="vehicleType" className="sr-only">
        Choose Your Type
      </label>
      <select
        id="vehicleType"
        value={selectedOption}
        onChange={handleSelection}
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
    name: "Z900",
    type: "Bike",
    imageUrl: image.image12,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1500,
  },
  {
    name: "BMW 1000 RR",
    type: "Bike",
    imageUrl: image.image4,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1550,
  },
  {
    name: "Duke",
    type: "Bike",
    imageUrl: image.image6,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1600,
  },
  {
    name: "Harley Davidson",
    type: "Bike",
    imageUrl: image.image7,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1650,
  },
  {
    name: "Hunter 350",
    type: "Bike",
    imageUrl: image.image8,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 4,
    pricePerDay: 1750,
  },
  {
    name: "Nissan Qashqai",
    type: "Car",
    imageUrl: image.image9,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 5,
    pricePerDay: 1800,
  },
  {
    name: "Range Rover Velar",
    type: "Car",
    imageUrl: image.image10,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 7,
    pricePerDay: 1900,
  },
  {
    name: "BMW M8 Competition",
    type: "Car",
    imageUrl: image.image5,
    fuelType: "Petrol",
    gearType: "Automatic",
    seats: 4,
    pricePerDay: 1950,
  },
  {
    name: "Swift",
    type: "Car",
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
        <VehicleCardComponent vc={vc} key={index} />
      ))}
    </div>
  );
}
