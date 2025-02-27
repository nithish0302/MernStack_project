import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "../SignIn&SignUp.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="signin-background">
      <div className="login-card">
        <h4 className="login-text">Log In to Rentals</h4>
        <p className="text">Quick & Simple way to Automate your payment</p>
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

        <div className="handling-comeback input-details-container ">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="check"
            />
            Remember Me
          </label>
          <button className="forgot-password">Forgot Password?</button>
        </div>

        <button className="signin-button">Sign In</button>
        <div className="maintain">
          <p className="or-use">OR USE</p>
          <p className="signup-link">SIGN UP</p>
        </div>
        <div className="social-login">
          <button className="social-btn google">
            <FcGoogle />
          </button>
          {/* <button className="social-btn apple">
            <FaApple />
          </button>
          <button className="social-btn facebook">
            <FaFacebook />
          </button> */}
        </div>
      </div>
    </div>
  );
}
