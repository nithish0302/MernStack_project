import React, { useState } from "react";
import "../../ForgotPass.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-title">Forgot Password</div>
      <div className="forgot-text">
        Enter your registered email to receive a password reset link.
      </div>

      <form className="forgot-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="forgot-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-button">
          Send Reset Link
        </button>
      </form>

      <div className="forgot-note">
        Remember your password?{" "}
        <a href="/signIn" className="forgot-link">
          Sign In
        </a>
      </div>
    </div>
  );
}
