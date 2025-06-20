import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../PreviousBookings.css";
import Header from "../General/Header";

export default function PreviousBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [afterKm, setAfterKm] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [rideKm, setRideKm] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

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

  const handleCompleteRide = async (booking) => {
    try {
      setSelectedBooking(booking);
      setAfterKm("");
      setPaymentMethod("");
      setShowPaymentOptions(false);

      const vehicleId = booking.vehicleId?._id || booking.vehicleId;

      if (!vehicleId) {
        throw new Error("No vehicle ID found in booking");
      }

      const response = await fetch(
        `http://localhost:8000/api/vech/${vehicleId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch vehicle");
      }

      setVehicleData(result.data);
    } catch (err) {
      console.error("Error fetching vehicle info:", err);
      alert(`Error: ${err.message}`);
      setVehicleData(null);
    }
  };

  const handleProceedToPayment = () => {
    if (!afterKm || isNaN(afterKm) || afterKm <= 0) {
      alert("Please enter a valid completed KM");
      return;
    }

    const prevKm = vehicleData?.completedKm || 0;
    const pricePerKm = vehicleData?.pricePerKm || 0;
    const drivenKm = afterKm - prevKm;

    if (drivenKm < 0) {
      alert("Completed KM cannot be less than previous KM!");
      return;
    }

    const amount = drivenKm * pricePerKm;

    setRideKm(drivenKm);
    setCalculatedAmount(amount);
    setShowPaymentOptions(true);
  };

  const handleCompletePayment = async () => {
    if (!afterKm || isNaN(afterKm)) {
      alert("Please enter valid KM reading");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${selectedBooking._id}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            afterKm: Number(afterKm),
            paymentMethod,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert(
          `Ride completed!\nDistance: ${rideKm} KM\nAmount: ₹${calculatedAmount.toFixed(
            2
          )}`
        );

        const vendorId = localStorage.getItem("vendorId");
        const response = await fetch(
          `http://localhost:8000/api/bookings/vendor/${vendorId}/all`
        );
        const data = await response.json();
        setBookings(
          data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );

        setSelectedBooking(null);
        setAfterKm("");
        setPaymentMethod("");
        setShowPaymentOptions(false);
      } else {
        alert(result.message || "Failed to complete ride");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to complete payment");
    }
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
              <p>
                <strong>Vehicle:</strong> {booking.vehicleName}
              </p>
              <p>
                <strong>Booked By:</strong> {booking.bookedName}
              </p>
              <p>
                <strong>Phone No:</strong> {booking.bookedPhone}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Vendor Status:</strong> {booking.statusOfVendor}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{booking.totalAmount}
              </p>
              {booking.statusOfVendor === "rideCompleted" && (
                <p>
                  <strong>Payment Status:</strong> Paid via{" "}
                  {booking.paymentMethod}
                </p>
              )}

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
            <span
              className="popup-close-x"
              onClick={() => setSelectedBooking(null)}
            >
              &times;
            </span>

            <h3>Complete Ride - {selectedBooking.vehicleName}</h3>
            <p>
              <strong>Before Ride KM:</strong>{" "}
              {vehicleData?.completedKm || "Loading..."}
            </p>

            <input
              type="number"
              placeholder="Enter Completed KM"
              value={afterKm}
              onChange={(e) => setAfterKm(e.target.value)}
              min={vehicleData?.completedKm || 0}
            />

            {!showPaymentOptions ? (
              <button className="proceed-btn" onClick={handleProceedToPayment}>
                Proceed with Payment
              </button>
            ) : (
              <>
                <p>
                  <strong>Driven KM:</strong> {rideKm} KM
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{calculatedAmount.toFixed(2)}
                </p>

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
          </div>
        </div>
      )}
    </>
  );
}
