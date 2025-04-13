import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header";
import "../../VendorProfilePage.css";

export default function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const response = await axios.get("/api/vendors/profile", {
          withCredentials: true,
        });

        setVendor(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          gender: response.data.gender || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          pincode: response.data.pincode || "",
          companyName: response.data.companyName || "",
          aadharNumber: response.data.aadharNumber || "",
          panNumber: response.data.panNumber || "",
          bankAccountNumber: response.data.bankAccountNumber || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/api/vendors/profile", formData, {
        withCredentials: true,
      });

      setVendor(response.data.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <div className="vendor-loading">Loading profile...</div>;
  if (error) return <div className="vendor-error">{error}</div>;

  return (
    <>
      <Header />
      <div className="vendor-profile-container">
        <h1 className="vendor-profile-title">Vendor Profile</h1>

        {!editMode ? (
          <div className="vendor-profile-view">
            <div className="vendor-profile-header">
              <h2>{vendor?.name}</h2>
              <span className="vendor-role-badge">VENDOR</span>
              {vendor?.companyName && (
                <div className="vendor-company-name">{vendor.companyName}</div>
              )}
            </div>

            <div className="vendor-profile-details">
              <div className="vendor-detail-row">
                <span>Email:</span>
                <span>{vendor?.email}</span>
              </div>
              {vendor?.phone && (
                <div className="vendor-detail-row">
                  <span>Phone:</span>
                  <span>{vendor?.phone}</span>
                </div>
              )}
              {vendor?.gender && (
                <div className="vendor-detail-row">
                  <span>Gender:</span>
                  <span>{vendor?.gender}</span>
                </div>
              )}
              {vendor?.aadharNumber && (
                <div className="vendor-detail-row">
                  <span>Aadhar Number:</span>
                  <span>{vendor?.aadharNumber}</span>
                </div>
              )}
              {vendor?.panNumber && (
                <div className="vendor-detail-row">
                  <span>PAN Number:</span>
                  <span>{vendor?.panNumber}</span>
                </div>
              )}
              {vendor?.bankAccountNumber && (
                <div className="vendor-detail-row">
                  <span>Bank Account:</span>
                  <span>{vendor?.bankAccountNumber}</span>
                </div>
              )}
              {vendor?.address && (
                <div className="vendor-detail-row">
                  <span>Address:</span>
                  <span>{vendor?.address}</span>
                </div>
              )}
              {(vendor?.city || vendor?.state || vendor?.pincode) && (
                <div className="vendor-detail-row">
                  <span>Location:</span>
                  <span>
                    {[vendor?.city, vendor?.state, vendor?.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            <button
              className="vendor-edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="vendor-profile-form" onSubmit={handleSubmit}>
            <div className="vendor-form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="vendor-form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="vendor-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="vendor-disabled-input"
              />
            </div>

            <div className="vendor-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 1234567890"
              />
            </div>

            <div className="vendor-form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="vendor-form-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX"
              />
            </div>

            <div className="vendor-form-group">
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="vendor-form-group">
              <label>Bank Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                placeholder="XXXXXXXXXX"
              />
            </div>

            <div className="vendor-form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
              />
            </div>

            <div className="vendor-form-row">
              <div className="vendor-form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vendor-form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vendor-form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="vendor-form-actions">
              <button
                type="button"
                className="vendor-cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button type="submit" className="vendor-save-btn">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
