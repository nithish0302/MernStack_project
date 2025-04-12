// import { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import "../../CarPage.css";
// import VehicleCardComponent from "./VechileCardComponenet.jsx";
// import axios from "axios";

// export default function CarPage() {
//   const [selectedMake, setSelectedMake] = useState("Select Make");
//   const [selectedModel, setSelectedModel] = useState("Select Model");
//   const [selectedPrice, setSelectedPrice] = useState("Select Price");
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/vech/cars",
//           {
//             params: {
//               populate: "vendor", // This depends on your backend implementation
//             },
//           }
//         );
//         const data = response.data;
//         console.log(data);
//         setCars(data);
//         // console.log(typeof response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load cars. Please try again later.");
//         setLoading(false);
//         console.error("Error fetching cars:", err);
//       }
//     };

//     fetchCars();
//   }, []);

//   if (loading) return <div className="loading">Loading cars...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <>
//       <Header />
//       <CarSearchBar
//         selectedMake={selectedMake}
//         setSelectedMake={setSelectedMake}
//         selectedModel={selectedModel}
//         setSelectedModel={setSelectedModel}
//         selectedPrice={selectedPrice}
//         setSelectedPrice={setSelectedPrice}
//       />
//       <Vehicle
//         vehicles={cars}
//         selectedMake={selectedMake}
//         selectedModel={selectedModel}
//         selectedPrice={selectedPrice}
//       />
//     </>
//   );
// }

// function CarSearchBar({
//   selectedMake,
//   setSelectedMake,
//   selectedModel,
//   setSelectedModel,
//   selectedPrice,
//   setSelectedPrice,
// }) {
//   const makeOptions = [
//     "Select Make",
//     "Maruti Suzuki",
//     "Nissan",
//     "Land Rover",
//     "BMW",
//   ];

//   const modelOptions = [
//     "Select Model",
//     "Swift",
//     "Nissan Qashqai",
//     "Range Rover Velar",
//     "BMW M8 Competition",
//   ];

//   const priceOptions = [
//     "Select Price",
//     "₹1500 - ₹1800",
//     "₹1800 - ₹2100",
//     "₹2100 - ₹2500",
//     "₹2500 - ₹3000",
//   ];

//   return (
//     <div className="search-bar">
//       <select
//         className="dropdown"
//         value={selectedMake}
//         onChange={(e) => setSelectedMake(e.target.value)}
//       >
//         {makeOptions.map((make, index) => (
//           <option key={`make-${index}`} value={make}>
//             {make}
//           </option>
//         ))}
//       </select>

//       <select
//         className="dropdown"
//         value={selectedModel}
//         onChange={(e) => setSelectedModel(e.target.value)}
//       >
//         {modelOptions.map((model, index) => (
//           <option key={`model-${index}`} value={model}>
//             {model}
//           </option>
//         ))}
//       </select>

//       <select
//         className="dropdown"
//         value={selectedPrice}
//         onChange={(e) => setSelectedPrice(e.target.value)}
//       >
//         {priceOptions.map((price, index) => (
//           <option key={`price-${index}`} value={price}>
//             {price}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function Vehicle({ vehicles, selectedMake, selectedModel, selectedPrice }) {
//   const filteredVehicles = vehicles.filter((vehicle) => {
//     const priceRange = selectedPrice.match(/\d+/g);
//     const minPrice = priceRange ? parseInt(priceRange[0]) : 0;
//     const maxPrice = priceRange ? parseInt(priceRange[1]) : Infinity;

//     return (
//       vehicle.type === "Car" &&
//       (selectedMake === "Select Make" || vehicle.make === selectedMake) &&
//       (selectedModel === "Select Model" || vehicle.name === selectedModel) &&
//       (selectedPrice === "Select Price" ||
//         (vehicle.pricePerDay >= minPrice && vehicle.pricePerDay <= maxPrice))
//     );
//   });

//   return (
//     <div className="vehicle-container">
//       {filteredVehicles.length > 0 ? (
//         filteredVehicles.map((vehicle) => (
//           <VehicleCardComponent
//             key={vehicle._id}
//             vehicleId={vehicle._id}
//             vc={{
//               ...vehicle,
//               imageUrl: vehicle.image || "/default-car.jpg",
//               make: vehicle.make || "Unknown Make",
//             }}
//           />
//         ))
//       ) : (
//         <p className="no-results">No cars match your search criteria.</p>
//       )}
//     </div>
//   );
// }
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/vech/cars",
          {
            params: { populate: "vendor" },
          }
        );

        // Handle different possible response structures
        const responseData = response.data;
        const carsData =
          responseData.data || // If data is nested in data property
          responseData.cars || // If data is in cars property
          responseData; // If data is the direct response

        setCars(Array.isArray(carsData) ? carsData : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cars. Please try again later.");
        setLoading(false);
        console.error("Error fetching cars:", err);
      }
    };

    fetchCars();
  }, []);

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
}) {
  const makeOptions = [
    "Select Make",
    "Maruti Suzuki",
    "Nissan",
    "Land Rover",
    "BMW",
  ];

  const modelOptions = [
    "Select Model",
    "Swift",
    "Nissan Qashqai",
    "Range Rover Velar",
    "BMW M8 Competition",
  ];

  const priceOptions = [
    "Select Price",
    "₹1500 - ₹1800",
    "₹1800 - ₹2100",
    "₹2100 - ₹2500",
    "₹2500 - ₹3000",
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
}) {
  // Ensure vehicles is always an array and handle potential undefined/null cases
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  const filteredVehicles = safeVehicles.filter((vehicle) => {
    // Skip if vehicle is null/undefined
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
