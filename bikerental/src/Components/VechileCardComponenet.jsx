import React from "react";
import { CgArrowTopRight } from "react-icons/cg";

const VehicleCardComponent = ({ vc, index }) => {
  return (
    <div key={index} className="vehicle-card">
      <img src={vc.imageUrl} alt={vc.type} className="vehicle-image" />
      <div className="vehicle-content">
        <h3 className="vehicle-title">{vc.name}</h3>
        <hr />
        <div className="vehicle-specs">
          <p>⛽ {vc.fuelType}</p>
          <p>⚙️ {vc.gearType}</p>
          <p>🛋️ {vc.seats} Seats</p>
        </div>
        <hr />
        <div className="vehicle-footer">
          <p className="vehicle-price">Rs {vc.pricePerDay}/day</p>
          <button className="vehicle-button">
            View Details <CgArrowTopRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCardComponent;
