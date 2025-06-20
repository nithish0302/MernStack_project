import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "../../CarPage.css";
import VehicleCardComponent from "./VechileCardComponenet.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BikePage() {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("Select Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedPrice, setSelectedPrice] = useState("Select Price");
  const [bikes, setBikes] = useState([]);
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

        let bikesResponse;
        if (role === "vendor" && id) {
          try {
            bikesResponse = await axios.get(
              `http://localhost:8000/api/vech/bikes/${id}`
            );

            const responseData = bikesResponse.data;
            const bikesData =
              responseData.data || responseData.bikes || responseData;

            if (
              !bikesData ||
              (Array.isArray(bikesData) && bikesData.length === 0) ||
              (typeof bikesData === "object" &&
                Object.keys(bikesData).length === 0)
            ) {
              setIsVendorEmpty(true);
              setLoading(false);
              return;
            }

            setBikes(Array.isArray(bikesData) ? bikesData : []);
            updateFilterOptions(bikesData);
          } catch (err) {
            if (err.response && err.response.status === 404) {
              setIsVendorEmpty(true);
              setLoading(false);
              return;
            }
            throw err;
          }
        } else {
          // User: Fetch all bikes
          bikesResponse = await axios.get(
            "http://localhost:8000/api/vech/bikes",
            { params: { populate: "vendor" } }
          );

          const responseData = bikesResponse.data;
          const bikesData =
            responseData.data || responseData.bikes || responseData;
          setBikes(Array.isArray(bikesData) ? bikesData : []);
          updateFilterOptions(bikesData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load data. Please try again later."
        );
        setLoading(false);
      }
    };

    const updateFilterOptions = (bikesData) => {
      if (!bikesData || bikesData.length === 0) return;

      const activeBikes = Array.isArray(bikesData) ? bikesData : [bikesData];

      const uniqueMakes = [
        ...new Set(activeBikes.map((bike) => bike.make).filter(Boolean)),
      ];
      const uniqueModels = [
        ...new Set(activeBikes.map((bike) => bike.name).filter(Boolean)),
      ];

      const prices = activeBikes
        .map((bike) => bike.pricePerKm)
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
    const ranges = [];
    const step = 100;
    for (let i = Math.floor(min / step) * step; i < max; i += step) {
      ranges.push(`₹${i} - ₹${i + step}`);
    }
    // Add one more range for the max price
    ranges.push(`₹${Math.floor(max / step) * step}+`);
    return ranges;
  };

  if (loading) return <div className="loading">Loading bikes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      {isVendorEmpty ? (
        <div className="empty-vendor-message">
          <h2>You haven't listed any bikes yet.</h2>
          <p>Start earning today by renting out your bike!</p>
          <button
            className="add-bike-button"
            onClick={() => navigate("/addbike")}
          >
            List Your Bike
          </button>
        </div>
      ) : (
        <>
          {bikes.length > 0 && (
            <BikeSearchBar
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
            vehicles={bikes}
            selectedMake={selectedMake}
            selectedModel={selectedModel}
            selectedPrice={selectedPrice}
            vehicleType="Bike"
          />
        </>
      )}
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
  vehicleType = "Bike",
}) {
  const filteredVehicles = vehicles.filter((vehicle) => {
    const userRole = localStorage.getItem("userRole");

    if (!vehicle || vehicle.isAvailable === false) return false;

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
              imageUrl: vehicle.image || "/default-bike.jpg",
              make: vehicle.make || "Unknown Make",
              pricePerKm: vehicle.pricePerKm || 0,
            }}
          />
        ))
      ) : (
        <p className="no-results">
          {vehicles.length === 0
            ? "No bikes available at the moment."
            : "No bikes match your search criteria."}
        </p>
      )}
    </div>
  );
}
