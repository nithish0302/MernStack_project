// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../PreviousBookings.css";
// import Header from "../General/Header";

// export default function PreviousBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const vendorId = localStorage.getItem("vendorId");
//         if (!vendorId) {
//           setError("Vendor not logged in");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(
//           `http://localhost:8000/api/bookings/vendor/${vendorId}/all`
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch bookings: ${response.statusText}`);
//         }

//         const data = await response.json();

//         const sortedBookings = data.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setBookings(sortedBookings);
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleViewRequest = (bookingId) => {
//     navigate("/vendor-requests");
//   };

//   const handleCompleteRide = async (bookingId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/complete`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update ride status");
//       }

//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === bookingId ? { ...b, statusOfVendor: "rideCompleted" } : b
//         )
//       );
//     } catch (err) {
//       alert("Error completing ride: " + err.message);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="previous-bookings-container">
//         <h2>All Vendor Bookings</h2>

//         {loading && <div className="loading">Loading bookings...</div>}
//         {error && <div className="error">{error}</div>}
//         {!loading && !error && bookings.length === 0 && (
//           <div className="no-bookings">No bookings found.</div>
//         )}
//         <ul className="bookings-list">
//           {bookings.map((booking) => (
//             <li key={booking._id} className="booking-item">
//               <strong>Vehicle:</strong> {booking.vehicleName} <br />
//               <strong>Booked By:</strong> {booking.bookedName} <br />
//               <strong>Start Date:</strong>{" "}
//               {new Date(booking.startDate).toLocaleDateString()} <br />
//               <strong>End Date:</strong>{" "}
//               {new Date(booking.endDate).toLocaleDateString()} <br />
//               <strong>Status:</strong> {booking.status} <br />
//               <strong>Vendor Status:</strong> {booking.statusOfVendor} <br />
//               <strong>Total Amount:</strong> ${booking.totalAmount}
//               {booking.statusOfVendor === "pending" && (
//                 <button
//                   className="action-button view-request-button"
//                   onClick={() => handleViewRequest(booking._id)}
//                 >
//                   View Request
//                 </button>
//               )}
//               {booking.statusOfVendor === "accepted" && (
//                 <button
//                   className="action-button complete-ride-button"
//                   onClick={() => handleCompleteRide(booking._id)}
//                 >
//                   Complete Ride
//                 </button>
//               )}
//               {booking.statusOfVendor === "rideCompleted" && (
//                 <span className="ride-completed-label">Ride Completed</span>
//               )}
//               {booking.statusOfVendor === "cancelled" && (
//                 <span className="ride-cancelled-label">Ride Cancelled</span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../PreviousBookings.css";
import Header from "../General/Header";

export default function PreviousBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [afterKm, setAfterKm] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const vendorId = localStorage.getItem("vendorId");
        if (!vendorId) {
          setError("Vendor not logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/bookings/vendor/${vendorId}/all`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const data = await response.json();

        const sortedBookings = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sortedBookings);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewRequest = (bookingId) => {
    navigate("/vendor-requests");
  };

  const handleCompleteRide = (booking) => {
    setSelectedBooking(booking);
  };

  const handleProceedToPayment = () => {
    if (!afterKm || isNaN(afterKm) || afterKm <= 0) {
      alert("Please enter a valid completed KM");
      return;
    }
    setShowPaymentOptions(true);
  };

  const handleCompletePayment = () => {
    alert(`Payment completed via ${paymentMethod}`);
    setSelectedBooking(null);
    setAfterKm("");
    setShowPaymentOptions(false);
    setPaymentMethod("");
    // Backend logic will be added later
  };

  return (
    <>
      <Header />
      <div className="previous-bookings-container">
        <h2>All Vendor Bookings</h2>

        {loading && <div className="loading">Loading bookings...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && bookings.length === 0 && (
          <div className="no-bookings">No bookings found.</div>
        )}
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <strong>Vehicle:</strong> {booking.vehicleName} <br />
              <strong>Booked By:</strong> {booking.bookedName} <br />
              <strong>Start Date:</strong>{" "}
              {new Date(booking.startDate).toLocaleDateString()} <br />
              <strong>End Date:</strong>{" "}
              {new Date(booking.endDate).toLocaleDateString()} <br />
              <strong>Status:</strong> {booking.status} <br />
              <strong>Vendor Status:</strong> {booking.statusOfVendor} <br />
              <strong>Total Amount:</strong> ₹{booking.totalAmount}
              {booking.statusOfVendor === "pending" && (
                <button
                  className="action-button view-request-button"
                  onClick={() => handleViewRequest(booking._id)}
                >
                  View Request
                </button>
              )}
              {booking.statusOfVendor === "accepted" && (
                <button
                  className="action-button complete-ride-button"
                  onClick={() => handleCompleteRide(booking)}
                >
                  Complete Ride
                </button>
              )}
              {booking.statusOfVendor === "rideCompleted" && (
                <span className="ride-completed-label">Ride Completed</span>
              )}
              {booking.statusOfVendor === "cancelled" && (
                <span className="ride-cancelled-label">Ride Cancelled</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {selectedBooking && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <h3>Complete Ride - {selectedBooking.vehicleName}</h3>
            <p>
              <strong>Before Ride KM:</strong> 0 (add actual logic later)
            </p>

            <input
              type="number"
              placeholder="Enter Completed KM"
              value={afterKm}
              onChange={(e) => setAfterKm(e.target.value)}
            />

            {!showPaymentOptions && (
              <button className="proceed-btn" onClick={handleProceedToPayment}>
                Proceed with Payment
              </button>
            )}

            {showPaymentOptions && (
              <>
                <div className="payment-options">
                  <button
                    className={`payment-btn ${
                      paymentMethod === "QR" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("QR")}
                  >
                    Pay via QR
                  </button>
                  <button
                    className={`payment-btn ${
                      paymentMethod === "Cash" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    Pay by Hand Cash
                  </button>
                </div>

                {paymentMethod === "QR" && (
                  <div className="qr-section">
                    <img src="/qr-placeholder.png" alt="QR Code" />
                    <p>Scan the QR code to pay</p>
                  </div>
                )}

                {paymentMethod && (
                  <button
                    className="complete-btn"
                    onClick={handleCompletePayment}
                  >
                    Complete Payment
                  </button>
                )}
              </>
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
