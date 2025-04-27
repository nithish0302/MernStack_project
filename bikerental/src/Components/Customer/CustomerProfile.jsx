import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../General/Header";
import "../../UserProfilePage.css";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
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
    drivinglincense: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          gender: response.data.gender || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          pincode: response.data.pincode || "",
          drivinglincense: response.data.drivinglincense || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "http://localhost:8000/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        drivinglincense: user.drivinglincense || "",
      });
    }
    setEditMode(false);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <h1 className="user-profile-title">My Profile</h1>

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
              <div className="user-form-group">
                <label>Driving License No</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.drivinglincense}
                  onChange={handleInputChange}
                />
              </div>
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
              <h2>{user?.name}</h2>
              <span className={`user-role-badge ${user?.role}`}>
                {user?.role}
              </span>
            </div>

            <div className="user-profile-details">
              <div className="user-detail-row">
                <span>Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="user-detail-row">
                <span>Phone:</span>
                <span>{user?.phone || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Gender:</span>
                <span>{user?.gender || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Address:</span>
                <span>{user?.address || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>City:</span>
                <span>{user?.city || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>State:</span>
                <span>{user?.state || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Pincode:</span>
                <span>{user?.pincode || "-"}</span>
              </div>
              <div className="user-detail-row">
                <span>Driving License No:</span>
                <span>{user?.drivinglincense || "-"}</span>
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
