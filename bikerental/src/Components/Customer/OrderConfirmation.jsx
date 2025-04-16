import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../OrderConfirmation.css";

function OrderConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <h1>Your Order is Booked!</h1>
        <p className="confirmation-text">
          Thank you for choosing us. Your vehicle is reserved and we've sent the
          details to your email address.
        </p>
        <button className="home-button" onClick={() => navigate("/customer")}>
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
