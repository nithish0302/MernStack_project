const express = require("express");
const router = express.Router();
const {
  getVendorProfile,
  updateVendorProfile,
} = require("../controllers/vendorController");

const isVendorLoggedIn = require("../Middleware/authMiddleware");

// Protected routes
router.get("/profile", isVendorLoggedIn, getVendorProfile);
router.patch("/profile", isVendorLoggedIn, updateVendorProfile);

module.exports = router;
