import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../reqven.css";

const VendorRequiredFields = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    companyName: "",
    aadharNumber: "",
    panNumber: "",
    bankAccountNumber: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/vendors/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const vendor = response.data;
        setFormData((prev) => ({
          ...prev,
          name: vendor.name,
          email: vendor.email,
        }));
      } catch (err) {
        setError("Failed to load vendor information");
      }
    };

    fetchVendor();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const req = await axios.patch(
        "http://localhost:8000/api/vendors/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/vendor");
    } catch (err) {
      setError("Failed to submit vendor details");
    }
  };

  return (
    <div className="reqven-vendor-required-form-container">
      <form className="reqven-vendor-profile-form" onSubmit={handleSubmit}>
        <h2 className="reqven-form-header">Complete Vendor Details</h2>

        <div className="reqven-input-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} disabled />
        </div>
        <div className="reqven-input-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        <div className="reqven-input-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="reqven-input-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>Aadhar Number:</label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="reqven-input-group">
          <label>PAN Number:</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
          />
        </div>
        <div className="reqven-input-group">
          <label>Bank Account Number:</label>
          <input
            type="text"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleChange}
          />
        </div>

        <button className="reqven-submit-button" type="submit">
          Submit
        </button>
        {error && <p className="reqven-error-message">{error}</p>}
      </form>
    </div>
  );
};

export default VendorRequiredFields;
