const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addVehicle,
  getCars,
  getBikes,
  getVendorVehicleCount,
  getCarsByVendor,
  getBikesByVendor,
  deleteVehicle,
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
    fileSize: 5 * 1024 * 1024,
  },
});

// Vehicle CRUD endpoints
router.post("/bikes", upload.single("image"), addVehicle);
router.post("/cars", upload.single("image"), addVehicle);

// Vehicle listing endpoints
router.get("/cars", getCars);
router.get("/bikes", getBikes);

// Vendor vehicle count endpoint
router.get("/count/:vendorId", getVendorVehicleCount);
router.get("/cars/:vendorId", getCarsByVendor);
router.get("/bikes/:vendorId", getBikesByVendor);
router.delete("/delete/:vehicleId", deleteVehicle);

module.exports = router;
