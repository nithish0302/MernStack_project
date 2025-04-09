import { useState } from "react";
import Header from "./Header.jsx";
import "../../CarPage.css";
import image from "../../assets/imageindex.js";
import VehicleCardComponent from "./VechileCardComponenet.jsx";

export default function BikePage() {
  const [selectedMake, setSelectedMake] = useState("Select Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedPrice, setSelectedPrice] = useState("Select Price");

  return (
    <>
      <Header />
      <BikeSearchBar
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
      />
      <Vehicle
        selectedMake={selectedMake}
        selectedModel={selectedModel}
        selectedPrice={selectedPrice}
      />
    </>
  );
}

function BikeSearchBar({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  selectedPrice,
  setSelectedPrice,
}) {
  return (
    <div className="search-bar">
      <select
        className="dropdown"
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
      >
        <option>Select Make</option>
        <option>Kawasaki</option>
        <option>BMW</option>
        <option>KTM</option>
        <option>Harley Davidson</option>
        <option>Royal Enfield</option>
      </select>

      <select
        className="dropdown"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option>Select Model</option>
        <option>Z900</option>
        <option>BMW 1000 RR</option>
        <option>Duke</option>
        <option>Harley Davidson</option>
        <option>Hunter 350</option>
      </select>

      <select
        className="dropdown"
        value={selectedPrice}
        onChange={(e) => setSelectedPrice(e.target.value)}
      >
        <option>Select Price</option>
        <option>₹1500 - ₹1600</option>
        <option>₹1600 - ₹1700</option>
        <option>₹1700 - ₹1800</option>
      </select>

      {/* <button className="search-button">🔍 Search Bike</button> */}
    </div>
  );
}
const vehiclesData = [
  {
    name: "Z900",
    make: "Kawasaki",
    type: "Bike",
    imageUrl: image.image12,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1500,
  },
  {
    name: "BMW 1000 RR",
    make: "BMW",
    type: "Bike",
    imageUrl: image.image4,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1550,
  },
  {
    name: "Duke",
    make: "KTM",
    type: "Bike",
    imageUrl: image.image6,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1600,
  },
  {
    name: "Harley Davidson",
    make: "Harley Davidson",
    type: "Bike",
    imageUrl: image.image7,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1650,
  },
  {
    name: "Hunter 350",
    make: "Royal Enfield",
    type: "Bike",
    imageUrl: image.image8,
    fuelType: "Petrol",
    gearType: "Manual",
    seats: 2,
    pricePerDay: 1750,
  },
  {
    name: "Nissan Qashqai",
    make: "Nissan",
    type: "Car",
    imageUrl: image.image9,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 5,
    pricePerDay: 1800,
  },
  {
    name: "Range Rover Velar",
    make: "Land Rover",
    type: "Car",
    imageUrl: image.image10,
    fuelType: "Diesel",
    gearType: "Automatic",
    seats: 5,
    pricePerDay: 1900,
  },
  {
    name: "BMW M8 Competition",
    make: "BMW",
    type: "Car",
    imageUrl: image.image5,
    fuelType: "Petrol",
    gearType: "Automatic",
    seats: 4,
    pricePerDay: 1950,
  },
  {
    name: "Swift",
    make: "Maruti Suzuki",
    type: "Car",
    imageUrl: image.image11,
    fuelType: "Diesel",
    gearType: "Manual",
    seats: 5,
    pricePerDay: 2000,
  },
];

function Vehicle({ selectedMake, selectedModel, selectedPrice }) {
  const filteredVehicles = vehiclesData.filter((vc) => {
    let priceRange = selectedPrice.match(/\d+/g);
    let minPrice = priceRange ? parseInt(priceRange[0]) : 0;
    let maxPrice = priceRange ? parseInt(priceRange[1]) : Infinity;

    return (
      vc.type === "Bike" &&
      (selectedMake === "Select Make" || vc.make === selectedMake) &&
      (selectedModel === "Select Model" || vc.name === selectedModel) &&
      (selectedPrice === "Select Price" ||
        (vc.pricePerDay >= minPrice && vc.pricePerDay <= maxPrice))
    );
  });

  return (
    <div className="vehicle-container">
      {filteredVehicles.length > 0 ? (
        filteredVehicles.map((vc, index) => (
          <VehicleCardComponent vc={vc} key={index} />
        ))
      ) : (
        <p>No bikes match your search criteria.</p>
      )}
    </div>
  );
}
