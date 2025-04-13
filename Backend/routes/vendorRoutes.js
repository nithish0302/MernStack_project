const express = require("express");
const router = express.Router();
const {
  getVendorProfile,
  updateVendorProfile,
} = require("../controllers/vendorController");

// ✅ Fix: Import the middleware as a default import
const isVendorLoggedIn = require("../middleware/authMiddleware");

// Protected routes
router.get("/profile", isVendorLoggedIn, getVendorProfile);
router.patch("/profile", isVendorLoggedIn, updateVendorProfile);

module.exports = router;
