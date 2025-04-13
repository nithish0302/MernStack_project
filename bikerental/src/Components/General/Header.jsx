import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../../Header.css";
import logo from "../../assets/logo.avif";

export default function Header() {
  const [role, setRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setRole(null);
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoClick = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "vendor") {
      navigate("/vendor");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "customer") {
      navigate("/customer");
    } else {
      navigate("/");
    }
  };

  const handleProfileNavigation = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "vendor") {
      navigate("/myvenprofile");
    } else {
      navigate("/my-profile");
    }
    setShowDropdown(false);
  };

  return (
    <nav className="header-container">
      <div className="image-manage">
        <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick} />
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

        {role ? (
          <div className="profile-container" ref={dropdownRef}>
            <button className="profile-button" onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {showDropdown && (
              <div className="profile-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/my-bookings");
                    setShowDropdown(false);
                  }}
                >
                  My Bookings
                </button>
                <button
                  className="dropdown-item"
                  onClick={handleProfileNavigation}
                >
                  My Profile
                </button>
                <button
                  className="dropdown-item sign-out"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/signIn" className="signin">
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}
