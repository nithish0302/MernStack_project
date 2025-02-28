import { NavLink } from "react-router-dom";
import "../../Header.css";
import logo from "../../assets/logo.avif";

export default function Header() {
  return (
    <nav className="header-container">
      <div className="image-manage">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-links">
        <NavLink to="/customer" className="header-btn">
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
        <NavLink to="/signIn" className=" signin">
          Sign In
        </NavLink>
      </div>
    </nav>
  );
}
