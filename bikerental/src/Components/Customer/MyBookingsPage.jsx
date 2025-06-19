import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header";
import "../../MyBookingsPage.css";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("vendorId");
        if (!userId) {
          navigate("/signIn");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/bookings/user/${userId}`
        );

        const bookingsData = response.data.data || [];
        setBookings(bookingsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [navigate]);

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/bookings/user/${bookingId}/cancel`,
        {
          status: "cancelled",
          statusOfVendor: "cancelled",
        }
      );

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...response.data,
                status: "cancelled",
                statusOfVendor: "cancelled",
              }
            : booking
        )
      );

      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="bookings-container">
        <h1 className="bookings-title">My Bookings</h1>

        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className={`booking-card ${booking.status}`}
              >
                <div className="booking-content">
                  <div className="booking-header">
                    <h3>{booking.vehicleName}</h3>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>Customer:</span>
                      <span>{booking.bookedName}</span>
                    </div>
                    <div className="detail-row">
                      <span>Dates:</span>
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Amount:</span>
                      <span>₹{booking.totalAmount}</span>
                    </div>
                    <div className="detail-row">
                      <span>Contact:</span>
                      <span>{booking.bookedPhone}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {/* Cancel Button (only for ongoing bookings) */}
                    {booking.status === "ongoing" && (
                      <button
                        className="action-btn cancel"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}

                    {/* Vendor Status Indicator */}
                    <div className={`vendor-status ${booking.statusOfVendor}`}>
                      {booking.statusOfVendor === "pending" && (
                        <span> Waiting for the vendor to accept</span>
                      )}
                      {booking.statusOfVendor === "accepted" && (
                        <span> Approved</span>
                      )}
                      {booking.statusOfVendor === "cancelled" && (
                        <span>Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
