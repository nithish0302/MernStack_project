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
          carsResponse = await axios.get(
            `http://localhost:8000/api/vech/cars/${id}`
          );
        } else {
          carsResponse = await axios.get(
            "http://localhost:8000/api/vech/cars",
            {
              params: { populate: "vendor" },
            }
          );
        }

        const responseData = carsResponse.data;
        const carsDataRaw =
          responseData.data || responseData.cars || responseData;
        let carsData = Array.isArray(carsDataRaw) ? carsDataRaw : [];

        carsData = carsData.map((car) => ({
          ...car,
          make: car.make || "Unknown Make",
          pricePerKm: Math.round(Number(car?.pricePerKm) || 0),
        }));

        setCars(carsData);

        const uniqueMakes = [
          ...new Set(carsData.map((car) => car.make)),
        ].filter(Boolean);
        const uniqueModels = [
          ...new Set(carsData.map((car) => car.name)),
        ].filter(Boolean);

        const priceList = carsData
          .map((car) => Number(car?.pricePerKm))
          .filter(
            (price) =>
              typeof price === "number" && !isNaN(price) && isFinite(price)
          );

        let priceRanges = ["Select Price"];
        if (priceList.length > 0) {
          const minPrice = Math.min(...priceList);
          const maxPrice = Math.max(...priceList);
          const generatedRanges = generatePriceRanges(minPrice, maxPrice);
          priceRanges = ["Select Price", ...generatedRanges];
        }

        setFilterOptions({
          makes: ["Select Make", ...uniqueMakes],
          models: ["Select Model", ...uniqueModels],
          priceRanges: priceRanges,
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

  const generatePriceRanges = (min, max) => {
    const MAX_RANGES = 10;
    if (
      isNaN(min) ||
      isNaN(max) ||
      !isFinite(min) ||
      !isFinite(max) ||
      min >= max
    ) {
      return [];
    }

    const ranges = [];
    const step = Math.max(5, Math.ceil((max - min) / MAX_RANGES));

    for (
      let i = Math.floor(min / step) * step;
      i < max && ranges.length < MAX_RANGES;
      i += step
    ) {
      ranges.push(`₹${i.toFixed(2)} - ₹${(i + step).toFixed(2)}`);
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
    if (!vehicle || vehicle.type !== "Car") return false;

    let minPrice = 0;
    let maxPrice = Infinity;

    if (selectedPrice !== "Select Price") {
      const priceRange = selectedPrice.match(/\d+\.?\d*/g);
      if (priceRange && priceRange.length === 2) {
        minPrice = parseFloat(priceRange[0]);
        maxPrice = parseFloat(priceRange[1]);
      }
    }

    const vehiclePrice = Number(vehicle?.pricePerKm) || 0;

    return (
      (selectedMake === "Select Make" || vehicle.make === selectedMake) &&
      (selectedModel === "Select Model" || vehicle.name === selectedModel) &&
      vehiclePrice >= minPrice &&
      vehiclePrice <= maxPrice
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
              imageUrl:
                vehicle.image?.replace(/\\/g, "/") || "/default-car.jpg",
              make: vehicle.make || "Unknown Make",
              pricePerKm: vehicle.pricePerKm,
            }}
          />
        ))
      ) : (
        <p className="no-results">No cars match your search criteria.</p>
      )}
    </div>
  );
}
