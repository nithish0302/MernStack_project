import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
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
  const [qrUrl, setQrUrl] = useState("");
  const [upiId, setUpiId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBooking]);

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
      // Reset all relevant states
      setSelectedBooking(booking);
      setAfterKm("");
      setPaymentMethod("");
      setShowPaymentOptions(false);
      setQrUrl("");
      setVehicleData(null);

      // Validate booking object
      if (!booking || typeof booking !== "object") {
        throw new Error("Invalid booking data");
      }

      // Get vehicle ID with basic validation
      const vehicleId = booking.vehicleId?._id || booking.vehicleId;
      if (!vehicleId || typeof vehicleId !== "string") {
        throw new Error("Invalid vehicle ID in booking");
      }

      // Fetch vehicle data with authorization
      const response = await fetch(
        `http://localhost:8000/api/vech/${vehicleId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Check response status first
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Then check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Server returned unexpected format: ${text.substring(0, 100)}`
        );
      }

      const result = await response.json();

      // Validate vehicle data structure
      if (
        !result.data ||
        typeof result.data.pricePerKm !== "number" ||
        typeof result.data.completedKm !== "number"
      ) {
        throw new Error("Invalid vehicle data structure received");
      }

      // Set vehicle data if all validations pass
      setVehicleData(result.data);
    } catch (err) {
      console.error("Error in handleCompleteRide:", err);

      // User-friendly error messages
      let userMessage = err.message;
      if (err.message.includes("Failed to fetch")) {
        userMessage = "Network error. Please check your connection.";
      } else if (err.message.includes("status")) {
        userMessage = "Server error. Please try again later.";
      }

      alert(`Error: ${userMessage}`);

      // Reset states on error
      setSelectedBooking(null);
      setVehicleData(null);
    }
  };

  const handleProceedToPayment = async () => {
    // Validate KM input
    if (!afterKm || isNaN(afterKm)) {
      alert("Please enter a valid number for completed KM");
      return;
    }

    const numericAfterKm = Number(afterKm);
    const prevKm = vehicleData?.completedKm || 0;

    if (numericAfterKm <= prevKm) {
      alert("Completed KM must be greater than previous KM reading");
      return;
    }

    // Calculate amount
    const pricePerKm = vehicleData?.pricePerKm || 0;
    const drivenKm = numericAfterKm - prevKm;
    const amount = drivenKm * pricePerKm;

    try {
      // Fetch vendor data with error handling
      const vendorRes = await fetch(
        `http://localhost:8000/api/vendors/${selectedBooking.vendorId}`, // Changed from /api/vendors/
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!vendorRes.ok) {
        throw new Error(`Failed to fetch vendor: ${vendorRes.status}`);
      }

      const vendorData = await vendorRes.json();

      // Update state
      setRideKm(drivenKm);
      setCalculatedAmount(amount);
      setShowPaymentOptions(true);

      // Generate QR if UPI available

      if (vendorData.data.upiId) {
        const upiUri = `upi://pay?pa=${vendorData.data.upiId}&pn=${
          selectedBooking.bookedName
        }&am=${amount.toFixed(2)}&cu=INR`;
        console.log("Generated UPI URI:", upiUri);
        setUpiId(vendorData.data.upiId);

        try {
          const qr = await QRCode.toDataURL(upiUri);
          setQrUrl(qr);
        } catch (qrError) {
          console.error("QR generation failed:", qrError);
          alert("Couldn't generate QR code. Please use cash payment.");
          setPaymentMethod("Cash");
        }
      } else {
        alert("Vendor UPI ID not found. Defaulting to cash payment.");
        setPaymentMethod("Cash");
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      alert("Error setting up payment options. Defaulting to cash.");
      setPaymentMethod("Cash");
      setShowPaymentOptions(true);
    }
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
          <div
            className={`popup-modal ${
              paymentMethod === "QR" ? "popup-shifted" : ""
            }`}
          >
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

                {paymentMethod === "QR" && qrUrl && (
                  <div className="qr-section">
                    <div className="qr-card">
                      <h2>Scan to Pay</h2>
                      <img src={qrUrl} alt="UPI QR Code" className="qr-image" />
                      <p>
                        <strong>Amount:</strong> ₹{calculatedAmount?.toFixed(2)}
                      </p>
                      <p className="scan-note">
                        Use any UPI app (e.g., GPay, PhonePe)
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(upiId);
                          alert("UPI ID copied to clipboard!");
                        }}
                        className="copy-btn"
                      >
                        Copy UPI ID
                      </button>
                    </div>
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
