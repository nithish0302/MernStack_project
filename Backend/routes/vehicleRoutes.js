const express = require("express");
const multer = require("multer");
const path = require("path");
const Vehicle = require("../models/vehicle");
const { addVehicle, getCars } = require("../controllers/vehicleController"); // Import the new controller function
const { ObjectId } = require("mongodb");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST endpoints
router.post("/bikes", upload.single("image"), addVehicle);
router.post("/cars", upload.single("image"), addVehicle);

// GET endpoints
router.get("/cars", getCars); // New GET endpoint for fetching cars

router.get("/count/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vehicles = await Vehicle.find({ vendor: vendorId.toString() });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
