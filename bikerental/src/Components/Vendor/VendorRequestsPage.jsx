import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header";
import "../../VendorRequestsPage.css";

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const vendorId = localStorage.getItem("vendorId");
        if (!vendorId) {
          navigate("/signIn");
          return;
        }

        console.log("Fetching requests for vendor:", vendorId); 

        const response = await axios.get(
          `http://localhost:8000/api/bookings/vendor/${vendorId}/requests`
        );

        console.log("Full API response:", response); 
        console.log("Response data:", response.data); 

        setRequests(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response?.data || err.message);
        setError("Failed to load requests. Please try again later.");
        setLoading(false);
      }
    };
    fetchRequests();
  }, [navigate]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/bookings/${bookingId}/status`,
        { status }
      );

      setRequests(
        requests.map((request) =>
          request._id === bookingId ? response.data : request
        )
      );

      alert(`Booking ${status} successfully`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to ${status} booking. Please try again.`);
    }
  };

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="requests-container">
        <h1 className="requests-title">New Booking Requests</h1>
        <p className="vendor-id">
          Vendor ID: {localStorage.getItem("vendorId")}
        </p>

        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>No new booking requests found</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.vehicleName}</h3>
                  <span className="request-status pending">Pending</span>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span>Booked By:</span>
                    <span>{request.bookedName}</span>
                  </div>
                  <div className="detail-row">
                    <span>Contact:</span>
                    <span>{request.bookedPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span>Dates:</span>
                    <span>
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Amount:</span>
                    <span>₹{request.totalAmount}</span>
                  </div>
                </div>

                <div className="request-actions">
                  <button
                    className="action-btn accept"
                    onClick={() => handleStatusUpdate(request._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => handleStatusUpdate(request._id, "cancelled")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
