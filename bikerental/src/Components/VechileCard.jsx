import "../App.css";
import { CgArrowTopRight } from "react-icons/cg";
import image from "../assets/imageindex.js";
import VehicleCardComponent from "../Components/VechileCardComponenet.jsx";

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
    gearType: "Manual", // Fixed typo
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

export default function Vehicle() {
  return (
    <div className="vehicle-container">
      {vehiclesData.map(
        (vc, index) =>
          vc.type === "Bike" && <VehicleCardComponent vc={vc} key={index} />
      )}
    </div>
  );
}
