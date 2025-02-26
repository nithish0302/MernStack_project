import "../App.css";
import { useState } from "react";

export default function CustomerFrontPage() {
  return (
    <div className="Customertop">
      <div>
        <h3 className="textInPage">
          Experience the freedom to go anywhere, anytime, with our affordable,
          reliable, and well-maintained vehicles—your perfect travel companion
          awaits.
        </h3>
        <VehicleSelector />
      </div>
    </div>
  );
}

function VehicleSelector() {
  const [selectedOption, setSelectedOption] = useState("");

  function handleSelection(e) {
    setSelectedOption(e.target.value);
    console.log(e.target.value);
  }

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
