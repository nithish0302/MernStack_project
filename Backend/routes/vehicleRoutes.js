const express = require("express");
const multer = require("multer");
const path = require("path");
const Vehicle = require("../models/vehicle");
const {
  addVehicle,
  getCars,
  getBikes, // Make sure this is imported
} = require("../controllers/vehicleController");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Vehicle CRUD endpoints
router.post("/bikes", upload.single("image"), addVehicle);
router.post("/cars", upload.single("image"), addVehicle);

// Vehicle listing endpoints
router.get("/cars", getCars);
router.get("/bikes", getBikes);

// Vendor vehicle count endpoint
router.get("/count/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Validate vendorId format
    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const vehicles = await Vehicle.find({ vendor: vendorId });

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.error("Error fetching vendor vehicles:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
