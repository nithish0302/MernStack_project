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
  getVehicleById,
  updateVehicle,
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

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Vehicle CRUD routes
router.post("/", upload.single("image"), addVehicle);
router.get("/cars", getCars);
router.get("/bikes", getBikes);
router.get("/count/:vendorId", getVendorVehicleCount);
router.get("/cars/:vendorId", getCarsByVendor);
router.get("/bikes/:vendorId", getBikesByVendor);
router.delete("/:vehicleId", deleteVehicle);
router.get("/:id", getVehicleById);
router.put("/:id", upload.single("image"), updateVehicle);

module.exports = router;
