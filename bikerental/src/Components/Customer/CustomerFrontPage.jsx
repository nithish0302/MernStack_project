import "../../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header.jsx";
import image from "../../assets/imageindex.js";
import VehicleCardComponent from "../General/VechileCardComponenet.jsx";

export default function CustomerFrontPage() {
  const isAuthenticated = !!localStorage.getItem("userRole");
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const [bikesResponse, carsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/vech/bikes"),
          axios.get("http://localhost:8000/api/vech/cars"),
        ]);

        const getVehicleData = (response) => {
          const data = response.data;
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.data)) return data.data;
          if (data && Array.isArray(data.vehicles)) return data.vehicles;
          if (data && Array.isArray(data.bikes)) return data.bikes;
          if (data && Array.isArray(data.cars)) return data.cars;
          return [];
        };

        setBikes(getVehicleData(bikesResponse).slice(0, 5));
        setCars(getVehicleData(carsResponse).slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError("Failed to load vehicles. Please try again later.");
        setLoading(false);
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div className="loading">Loading vehicles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="Customertop">
        <Header isAuthenticated={isAuthenticated} />
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
      <div className="vehicle-container">
        {[...bikes, ...cars].length > 0 ? (
          [...bikes, ...cars].map((vehicle, index) => (
            <VehicleCardComponent vc={vehicle} key={`vehicle-${index}`} />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No vehicles available
          </p>
        )}
      </div>
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
