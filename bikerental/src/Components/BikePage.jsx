import Header from "../Components/Header.jsx";
import "../CarPage.css";
import image from "../assets/imageindex.js";
import VehicleCardComponent from "../Components/VechileCardComponenet.jsx";

export default function BikePage() {
  return (
    <>
      <Header />
      <BikeSearchBar />
      <Vehicle />
    </>
  );
}

function BikeSearchBar() {
  return (
    <div className="search-bar">
      <select className="dropdown">
        <option>Select Make</option>
        <option>Maruti Suzuki</option>
        <option>Hyundai</option>
        <option>Tata</option>
        <option>Mahindra</option>
        <option>Honda</option>
        <option>Ford</option>
        <option>Renault</option>
        <option>Toyota</option>
        <option>Kia</option>
        <option>Volkswagen</option>
      </select>

      <select className="dropdown">
        <option>Select Model</option>
        <option>Swift</option>
        <option>i20</option>
        <option>Nexon</option>
        <option>XUV700</option>
        <option>City</option>
        <option>Ecosport</option>
        <option>Kwid</option>
        <option>Innova</option>
        <option>Seltos</option>
        <option>Polo</option>
      </select>

      <div className="price-filter">
        <span>Price:</span>
        <select className="dropdown">
          <option>Select Price</option>
          <option>₹1500 - ₹1800</option>
          <option>₹1800 - ₹2100</option>
          <option>₹2100 - ₹2500</option>
          <option>₹2500 - ₹3000</option>
        </select>
      </div>

      <button className="search-button">🔍 Search Cars</button>
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
      {vehiclesData.map(
        (vc, index) =>
          vc.type == "Bike" && <VehicleCardComponent vc={vc} key={index} />
      )}
    </div>
  );
}
