import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "../../CarPage.css";
import VehicleCardComponent from "./VechileCardComponenet.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CarPage() {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("Select Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedPrice, setSelectedPrice] = useState("Select Price");
  const [cars, setCars] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    makes: ["Select Make"],
    models: ["Select Model"],
    priceRanges: ["Select Price"],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVendorEmpty, setIsVendorEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("userRole");
        const id = localStorage.getItem("vendorId");

        let carsResponse;
        if (role === "vendor" && id) {
          try {
            carsResponse = await axios.get(
              `http://localhost:8000/api/vech/cars/${id}`
            );

            const responseData = carsResponse.data;
            const carsData =
              responseData.data || responseData.cars || responseData;

            if (
              !carsData ||
              (Array.isArray(carsData) && carsData.length === 0) ||
              (typeof carsData === "object" &&
                Object.keys(carsData).length === 0)
            ) {
              setIsVendorEmpty(true);
              setLoading(false);
              return;
            }

            const processedCars = processCarData(carsData);
            setCars(processedCars);
            updateFilterOptions(processedCars);
          } catch (err) {
            if (err.response?.status === 404) {
              setIsVendorEmpty(true);
              setLoading(false);
              return;
            }
            throw err;
          }
        } else {
          carsResponse = await axios.get(
            "http://localhost:8000/api/vech/cars",
            { params: { populate: "vendor" } }
          );

          const responseData = carsResponse.data;
          const carsData =
            responseData.data || responseData.cars || responseData;
          const processedCars = processCarData(carsData);
          setCars(processedCars);
          updateFilterOptions(processedCars);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load car data. Please try again later."
        );
        setLoading(false);
      }
    };

    const processCarData = (carsData) => {
      const carsArray = Array.isArray(carsData) ? carsData : [carsData];
      return carsArray.map((car) => ({
        ...car,
        make: car.make || "Unknown Make",
        name: car.name || "Unknown Model",
        pricePerKm: Math.round(Number(car?.pricePerKm)) || 0,
        image: car.image?.replace(/\\/g, "/") || "/default-car.jpg",
        type: "Car",
      }));
    };

    const updateFilterOptions = (processedCars) => {
      if (!processedCars || processedCars.length === 0) return;

      const uniqueMakes = [
        ...new Set(processedCars.map((car) => car.make)),
      ].filter(Boolean);
      const uniqueModels = [
        ...new Set(processedCars.map((car) => car.name)),
      ].filter(Boolean);

      const prices = processedCars
        .map((car) => car.pricePerKm)
        .filter((price) => !isNaN(price));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;
      const priceRanges = generatePriceRanges(minPrice, maxPrice);

      setFilterOptions({
        makes: ["Select Make", ...uniqueMakes],
        models: ["Select Model", ...uniqueModels],
        priceRanges: ["Select Price", ...priceRanges],
      });
    };

    fetchData();
  }, []);

  const generatePriceRanges = (min, max) => {
    const MAX_RANGES = 5;
    const range = max - min;
    const step = Math.ceil(range / MAX_RANGES / 100) * 100; // Round to nearest 100

    const ranges = [];
    for (let i = min; i < max && ranges.length < MAX_RANGES; i += step) {
      const upper = Math.min(i + step, max);
      ranges.push(`₹${i} - ₹${upper}`);
    }

    // Add final range if needed
    if (
      ranges.length === 0 ||
      ranges[ranges.length - 1].split(" - ₹")[1] < max
    ) {
      ranges.push(`₹${Math.floor(max / step) * step}+`);
    }

    return ranges;
  };

  if (loading) return <div className="loading">Loading cars...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      {isVendorEmpty ? (
        <div className="empty-vendor-message">
          <h2>You haven't listed any cars yet.</h2>
          <p>Start earning today by renting out your car!</p>
          <button
            className="add-bike-button"
            onClick={() => navigate("/addcar")}
          >
            List Your Car
          </button>
        </div>
      ) : (
        <>
          {cars.length > 0 && (
            <CarSearchBar
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              filterOptions={filterOptions}
            />
          )}
          <Vehicle
            vehicles={cars}
            selectedMake={selectedMake}
            selectedModel={selectedModel}
            selectedPrice={selectedPrice}
          />
        </>
      )}
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
  const filteredVehicles = vehicles.filter((vehicle) => {
    const userRole = localStorage.getItem("userRole");

    if (!vehicle || vehicle.type !== "Car") return false;

    // Handle price range filtering
    if (userRole !== "vendor" && vehicle.isAvailable === false) return false;

    let priceMatch = true;
    if (selectedPrice !== "Select Price") {
      if (selectedPrice.endsWith("+")) {
        const minPrice = parseInt(selectedPrice.match(/\d+/)[0]);
        priceMatch = vehicle.pricePerKm >= minPrice;
      } else {
        const priceRange = selectedPrice.match(/\d+/g);
        if (priceRange && priceRange.length >= 2) {
          const minPrice = parseInt(priceRange[0]);
          const maxPrice = parseInt(priceRange[1]);
          priceMatch =
            vehicle.pricePerKm >= minPrice && vehicle.pricePerKm <= maxPrice;
        }
      }
    }

    return (
      (selectedMake === "Select Make" || vehicle.make === selectedMake) &&
      (selectedModel === "Select Model" || vehicle.name === selectedModel) &&
      priceMatch
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
              imageUrl: vehicle.image,
              make: vehicle.make,
              pricePerKm: vehicle.pricePerKm,
            }}
          />
        ))
      ) : (
        <p className="no-results">
          {vehicles.length === 0
            ? "No cars available at the moment."
            : "No cars match your search criteria."}
        </p>
      )}
    </div>
  );
}
