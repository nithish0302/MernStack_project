const Vehicle = require("../models/vehicle");

const addVehicle = async (req, res) => {
  try {
    const { name, type, fuelType, gearType, seats, pricePerDay, vendor } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    const requiredFields = {
      name: "Name",
      type: "Type",
      fuelType: "Fuel Type",
      gearType: "Gear Type",
      seats: "Seats",
      pricePerDay: "Price Per Day",
      vendor: "Vendor",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate vehicle type
    if (!["Car", "Bike"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type. Must be either 'Car' or 'Bike'",
      });
    }

    // Create new vehicle
    const newVehicle = new Vehicle({
      name,
      type,
      fuelType,
      gearType,
      seats: Number(seats),
      pricePerDay: Number(pricePerDay),
      image,
      vendor,
      isAvailable: true,
    });

    await newVehicle.save();

    res.status(201).json({
      success: true,
      message: `${type} added successfully`,
      data: newVehicle,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in addVehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      suggestion: "Please check the data and try again",
    });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Vehicle.find({ type: "Car" }).populate("vendor");

    if (!cars || cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found in inventory",
        suggestion: "Add new cars to inventory",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cars retrieved successfully",
      count: cars.length,
      data: cars,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cars",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      retrySuggestion: "Please try again later",
    });
  }
};

const getBikes = async (req, res) => {
  try {
    const bikes = await Vehicle.find({ type: "Bike" }).populate("vendor");

    if (!bikes || bikes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bikes found in inventory",
        suggestion: "Add new bikes to inventory",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bikes retrieved successfully",
      count: bikes.length,
      data: bikes,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching bikes:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bikes",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      retrySuggestion: "Please try again later",
    });
  }
};

module.exports = {
  addVehicle,
  getCars,
  getBikes,
};
