import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "../SignIn&SignUp.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="signin-background">
      <div className="login-card">
        <h4 className="login-text">Sign up to Rentals</h4>
        <p className="text">Quick & Simple way to Automate your payment</p>
        <div className="input-details-container">
          <input
            type="text"
            placeholder="NAME"
            className="input-detail"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

        <div className="handling-comeback input-details-container">
          <label style={{ textDecoration: "underline" }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="check"
            />
            I agree to Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          className="signin-button"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: "300",
            fontSize: "20px",
          }}
        >
          CREATE AN ACCOUNT
        </button>
        <div className="maintain">
          <p className="or-use">OR USE</p>
          <p className="signup-link">SIGN In</p>
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
