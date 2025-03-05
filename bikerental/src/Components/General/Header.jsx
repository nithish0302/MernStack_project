import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Header.css";
import logo from "../../assets/logo.avif";

export default function Header() {
  const [role, setRole] = useState("customer");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "customer";
    setRole(storedRole);
  }, []);

  return (
    <nav className="header-container">
      <div className="image-manage">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-links">
        <NavLink
          to={
            role === "vendor"
              ? "/vendor"
              : role === "admin"
              ? "/admin"
              : "/customer"
          }
          className="header-btn"
        >
          Home
        </NavLink>
        <NavLink to="/carPage" className="header-btn">
          Car
        </NavLink>
        <NavLink to="/bikePage" className="header-btn">
          Bike
        </NavLink>
        <NavLink to="/contact" className="header-btn">
          Contact
        </NavLink>
        <NavLink to="/about" className="header-btn">
          About Us
        </NavLink>
        <NavLink to="/signIn" className="signin">
          Sign In
        </NavLink>
      </div>
    </nav>
  );
}
