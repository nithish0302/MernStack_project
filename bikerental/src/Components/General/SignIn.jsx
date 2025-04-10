import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "../../SignIn&SignUp.css";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  // Default role: 'user' instead of 'customer' to match backend schema
  const role = location.state?.role?.toLowerCase() || "user";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      console.log(role);

      const data = await response.json();
      // console.log(data.user.id);
      // console.log(data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);

        localStorage.setItem("vendorId", data.user.id);
        alert("Login Successful");

        // Role-based redirect
        switch (data.role) {
          case "vendor":
            navigate("/vendor");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/customer"); // assuming /customer is for users
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Error signing in. Please try again.");
    }
  };

  return (
    <div className="signin-background">
      <div className="login-card">
        <h4 className="login-text">Log In to Rentals</h4>
        <p className="text">Quick & Simple way to Automate your payment</p>

        {error && <p className="error-message">{error}</p>}

        <div className="input-details-container">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="input-detail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className="input-detail"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="handling-comeback">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="check"
            />
            Remember Me
          </label>

          <Link to="/forgot" className="forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button
          className="signin-button"
          onClick={handleSignIn}
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: "300",
            fontSize: "20px",
            height: "60px",
            paddingTop: "13px",
          }}
        >
          Sign In
        </button>

        <div className="maintain">
          <p className="or-use">OR USE</p>
          <Link to="/signup" className="signup-link" state={{ role }}>
            SIGN UP
          </Link>
        </div>

        <div className="social-login">
          <button className="social-btn google">
            <FcGoogle />
          </button>
        </div>
      </div>
    </div>
  );
}
