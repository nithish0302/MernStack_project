// import React from "react";
// import { CgArrowTopRight } from "react-icons/cg";
// import { useNavigate } from "react-router-dom";

// const VehicleCardComponent = ({ vc, vehicleId }) => {
//   const navigate = useNavigate();

//   const handleBookClick = () => {
//     navigate("/Order", {
//       state: {
//         vehicleData: {
//           id: vehicleId,
//           name: vc.name,
//           type: vc.type,
//           pricePerDay: vc.pricePerDay,
//           imageUrl: vc.imageUrl,
//           fuelType: vc.fuelType,
//           gearType: vc.gearType,
//           seats: vc.seats,
//         },
//       },
//     });
//   };

//   return (
//     <div className="vehicle-card">
//       <img src={vc.imageUrl} alt={vc.type} className="vehicle-image" />
//       <div className="vehicle-content">
//         <h3 className="vehicle-title">{vc.name}</h3>
//         <hr />
//         <div className="vehicle-specs">
//           <p>⛽ {vc.fuelType}</p>
//           <p>⚙️ {vc.gearType}</p>
//           <p>🛋️ {vc.seats} Seats</p>
//         </div>
//         <hr />
//         <div className="vehicle-footer">
//           <p className="vehicle-price">Rs {vc.pricePerDay}/day</p>
//           <button onClick={handleBookClick} className="vehicle-button">
//             Book Vehicle
//             <CgArrowTopRight />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VehicleCardComponent;
import React from "react";
import { CgArrowTopRight } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VehicleCardComponent = ({ vc, vehicleId }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleBookClick = () => {
    navigate("/Order", {
      state: {
        vehicleData: {
          id: vehicleId,
          name: vc.name,
          type: vc.type,
          pricePerDay: vc.pricePerDay,
          imageUrl: vc.imageUrl,
          fuelType: vc.fuelType,
          gearType: vc.gearType,
          seats: vc.seats,
        },
      },
    });
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/vech/delete/${vehicleId}`);
      alert("Vehicle deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      alert("Failed to delete vehicle. Please try again.");
    }
  };

  return (
    <div className="vehicle-card">
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
          {role === "vendor" ? (
            <button
              onClick={handleDeleteClick}
              className="vehicle-button danger"
            >
              Delete Vehicle
            </button>
          ) : (
            <button onClick={handleBookClick} className="vehicle-button">
              Book Vehicle <CgArrowTopRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCardComponent;
