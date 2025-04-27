import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header";
import "../../UserProfilePage.css";

export default function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // Initially false, will be true when user clicks "Edit Profile"
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
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/vendors/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  }, [editMode === false]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "http://localhost:8000/api/vendors/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the vendor state with the updated profile data
      setVendor(response.data);

      // Update the formData state with the updated data from the response
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

      setEditMode(false); // Switch back to the view mode
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        gender: vendor.gender || "",
        address: vendor.address || "",
        city: vendor.city || "",
        state: vendor.state || "",
        pincode: vendor.pincode || "",
        companyName: vendor.companyName || "",
        aadharNumber: vendor.aadharNumber || "",
        panNumber: vendor.panNumber || "",
        bankAccountNumber: vendor.bankAccountNumber || "",
      });
    }
    setEditMode(false); // Exit edit mode
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <h1 className="user-profile-title">Vendor Profile</h1>

        {editMode ? (
          <form className="user-profile-form" onSubmit={handleSubmit}>
            <div className="user-form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="user-form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="user-disabled-input"
              />
            </div>

            <div className="user-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
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

            <div className="user-form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-row">
              <div className="user-form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="user-form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="user-form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="user-form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label>Bank Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-actions">
              <button
                type="button"
                className="user-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="user-save-btn">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="user-profile-view">
            <div className="user-profile-header">
              <h2>{vendor?.name}</h2>
              <span className="user-role-badge">Vendor</span>
            </div>

            <div className="user-profile-details">
              <div className="user-detail-row">
                <span>Email:</span>
                <span>{vendor?.email}</span>
              </div>
              <div className="user-detail-row">
                <span>Phone:</span>
                <span>{vendor?.phone || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Gender:</span>
                <span>{vendor?.gender || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Address:</span>
                <span>{vendor?.address || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>City:</span>
                <span>{vendor?.city || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>State:</span>
                <span>{vendor?.state || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Pincode:</span>
                <span>{vendor?.pincode || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Company:</span>
                <span>{vendor?.companyName || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Aadhar No:</span>
                <span>{vendor?.aadharNumber || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>PAN No:</span>
                <span>{vendor?.panNumber || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Bank Account:</span>
                <span>{vendor?.bankAccountNumber || "-"}</span>
              </div>
            </div>

            <button className="user-edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </>
  );
}
