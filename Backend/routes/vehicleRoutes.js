const express = require("express");
const multer = require("multer");
const path = require("path");
const { addVehicle } = require("../controllers/vehicleController");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this matches the static files path in server.js
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Vehicle-related routes
router.post("/bikes", upload.single("image"), addVehicle);

module.exports = router;
