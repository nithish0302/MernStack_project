import { useNavigate } from "react-router-dom";
import backgroundImg from "../../assets/back.avif";
import "../../Home.css";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div
      className="role-selection-container"
      style={{
        background: `url(${backgroundImg}) no-repeat center center/cover`,
      }}
    >
      <div className="overlay"></div>
      <h2 className="role-selection-title">Welcome to Our Platform</h2>
      <p className="role-selection-text">
        Please select your role to proceed. Whether you're a customer looking
        for services, a vendor offering products, or an admin managing
        operations, we've got you covered.
      </p>

      <div className="role-buttons">
        <div className="role-card">
          <h3>Customer</h3>
          <p>Explore services and products tailored to your needs.</p>
          <button
            className="role-btn customer"
            onClick={() => navigate("/signup", { state: { role: "customer" } })}
          >
            Choose Customer
          </button>
        </div>

        <div className="role-card">
          <h3>Vendor</h3>
          <p>List your products and services to reach more customers.</p>
          <button
            className="role-btn vendor"
            onClick={() => navigate("/signup", { state: { role: "vendor" } })}
          >
            Choose Vendor
          </button>
        </div>

        <div className="role-card">
          <h3>Admin</h3>
          <p>Manage platform operations and ensure smooth functionality.</p>
          <button
            className="role-btn admin"
            onClick={() => navigate("/signup", { state: { role: "admin" } })}
          >
            Choose Admin
          </button>
        </div>
      </div>
    </div>
  );
}
