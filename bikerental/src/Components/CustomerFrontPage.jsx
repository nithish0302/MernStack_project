import "../App.css";
import { useState } from "react";
import toyota from "../assets/toyota.jpg";
import benz from "../assets/benz.jpg";
import bmw from "../assets/bmw.svg";
import suzuki from "../assets/suzuki-seeklogo.png";
import audi from "../assets/audi-seeklogo.png";

export default function CustomerFrontPage() {
  return (
    <>
      <div className="Customertop">
        <h3 className="textInPage">
          Experience the freedom to go anywhere, anytime, with our affordable,
          reliable, and well-maintained vehicles—your perfect travel companion
          awaits.
        </h3>
        <VehicleSelector />
      </div>
      <h3 className="drive">Drive the Vechile By Your Favourite Brand</h3>
      <br />
      <br />
      <hr />
      <div className="logos">
        <img src={toyota} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={bmw} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={benz} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={suzuki} alt="image" className="logo" />
        <span className="vertical-line"></span>
        <img src={audi} alt="image" className="logo" />
      </div>
      <br />
      <hr />
    </>
  );
}

function VehicleSelector() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div>
      <label htmlFor="vehicleType" className="sr-only">
        Choose Your Type
      </label>
      <select
        id="vehicleType"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
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
