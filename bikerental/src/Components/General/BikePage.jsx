import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "../../CarPage.css";
import VehicleCardComponent from "./VechileCardComponenet.jsx";
import axios from "axios";

export default function BikePage() {
  const [selectedMake, setSelectedMake] = useState("Select Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedPrice, setSelectedPrice] = useState("Select Price");
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/vech/bikes",
          {
            params: { populate: "vendor" },
          }
        );

        // Handle different possible response structures
        const responseData = response.data;
        const bikesData =
          responseData.data || // If data is nested in data property
          responseData.bikes || // If data is in bikes property
          responseData; // If data is the direct response

        setBikes(Array.isArray(bikesData) ? bikesData : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bikes. Please try again later.");
        setLoading(false);
        console.error("Error fetching bikes:", err);
      }
    };

    fetchBikes();
  }, []);

  if (loading) return <div className="loading">Loading bikes...</div>;
  if (error) return <div className="error">{error}</div>;

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
        vehicles={bikes}
        selectedMake={selectedMake}
        selectedModel={selectedModel}
        selectedPrice={selectedPrice}
        vehicleType="Bike"
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
  const makeOptions = [
    "Select Make",
    "Kawasaki",
    "BMW",
    "KTM",
    "Harley Davidson",
    "Royal Enfield",
  ];

  const modelOptions = [
    "Select Model",
    "Z900",
    "BMW 1000 RR",
    "Duke",
    "Harley Davidson",
    "Hunter 350",
  ];

  const priceOptions = [
    "Select Price",
    "₹1500 - ₹1600",
    "₹1600 - ₹1700",
    "₹1700 - ₹1800",
  ];

  return (
    <div className="search-bar">
      <select
        className="dropdown"
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
      >
        {makeOptions.map((make, index) => (
          <option key={`make-${index}`} value={make}>
            {make}
          </option>
        ))}
      </select>

      <select
        className="dropdown"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {modelOptions.map((model, index) => (
          <option key={`model-${index}`} value={model}>
            {model}
          </option>
        ))}
      </select>

      <select
        className="dropdown"
        value={selectedPrice}
        onChange={(e) => setSelectedPrice(e.target.value)}
      >
        {priceOptions.map((price, index) => (
          <option key={`price-${index}`} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
}

function Vehicle({
  vehicles = [],
  selectedMake,
  selectedModel,
  selectedPrice,
  vehicleType = "Bike",
}) {
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!vehicle) return false;

    const priceRange = selectedPrice.match(/\d+/g);
    const minPrice = priceRange ? parseInt(priceRange[0]) : 0;
    const maxPrice = priceRange ? parseInt(priceRange[1]) : Infinity;

    return (
      vehicle.type === vehicleType &&
      (selectedMake === "Select Make" || vehicle.make === selectedMake) &&
      (selectedModel === "Select Model" || vehicle.name === selectedModel) &&
      (selectedPrice === "Select Price" ||
        (vehicle.pricePerDay >= minPrice && vehicle.pricePerDay <= maxPrice))
    );
  });

  return (
    <div className="vehicle-container">
      {filteredVehicles.length > 0 ? (
        filteredVehicles.map((vehicle) => (
          <VehicleCardComponent
            key={vehicle._id || vehicle.id}
            vehicleId={vehicle._id || vehicle.id}
            vc={{
              ...vehicle,
              imageUrl: vehicle.image || "/default-bike.jpg",
              make: vehicle.make || "Unknown Make",
            }}
          />
        ))
      ) : (
        <p className="no-results">
          No {vehicleType.toLowerCase()}s match your search criteria.
        </p>
      )}
    </div>
  );
}
