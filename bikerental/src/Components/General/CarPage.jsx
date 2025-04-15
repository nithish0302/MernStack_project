import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "../../CarPage.css";
import VehicleCardComponent from "./VechileCardComponenet.jsx";
import axios from "axios";

export default function CarPage() {
  const [selectedMake, setSelectedMake] = useState("Select Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedPrice, setSelectedPrice] = useState("Select Price");
  const [cars, setCars] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    models: [],
    priceRanges: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("userRole");
        const id = localStorage.getItem("vendorId");

        let carsResponse;
        if (role === "vendor" && id) {
          // Vendor: Fetch cars by vendor ID
          carsResponse = await axios.get(
            `http://localhost:8000/api/vech/cars/${id}`
          );
        } else {
          // User: Fetch all cars
          carsResponse = await axios.get(
            "http://localhost:8000/api/vech/cars",
            {
              params: { populate: "vendor" },
            }
          );
        }

        const responseData = carsResponse.data;
        const carsData = responseData.data || responseData.cars || responseData;
        setCars(Array.isArray(carsData) ? carsData : []);

        // Extract filter options from cars
        const uniqueMakes = [...new Set(carsData.map((car) => car.make))];
        const uniqueModels = [...new Set(carsData.map((car) => car.name))];

        const minPrice = Math.min(...carsData.map((car) => car.pricePerDay));
        const maxPrice = Math.max(...carsData.map((car) => car.pricePerDay));
        const priceRanges = generatePriceRanges(minPrice, maxPrice);

        setFilterOptions({
          makes: ["Select Make", ...uniqueMakes],
          models: ["Select Model", ...uniqueModels],
          priceRanges: ["Select Price", ...priceRanges],
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate price ranges
  const generatePriceRanges = (min, max) => {
    const ranges = [];
    const step = 500; // ₹500 intervals
    for (let i = Math.floor(min / step) * step; i < max; i += step) {
      ranges.push(`₹${i} - ₹${i + step}`);
    }
    return ranges;
  };

  if (loading) return <div className="loading">Loading cars...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <CarSearchBar
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        filterOptions={filterOptions}
      />
      <Vehicle
        vehicles={cars}
        selectedMake={selectedMake}
        selectedModel={selectedModel}
        selectedPrice={selectedPrice}
      />
    </>
  );
}

function CarSearchBar({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  selectedPrice,
  setSelectedPrice,
  filterOptions,
}) {
  return (
    <div className="search-bar">
      <select
        className="dropdown"
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
      >
        {filterOptions.makes.map((make, index) => (
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
        {filterOptions.models.map((model, index) => (
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
        {filterOptions.priceRanges.map((price, index) => (
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
}) {
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  const filteredVehicles = safeVehicles.filter((vehicle) => {
    if (!vehicle) return false;

    const priceRange = selectedPrice.match(/\d+/g);
    const minPrice = priceRange ? parseInt(priceRange[0]) : 0;
    const maxPrice = priceRange ? parseInt(priceRange[1]) : Infinity;

    return (
      vehicle.type === "Car" &&
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
              imageUrl: vehicle.image || "/default-car.jpg",
              make: vehicle.make || "Unknown Make",
            }}
          />
        ))
      ) : (
        <p className="no-results">No cars match your search criteria.</p>
      )}
    </div>
  );
}
