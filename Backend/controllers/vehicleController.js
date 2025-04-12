const Vehicle = require("../models/vehicle");

const addVehicle = async (req, res) => {
  try {
    const { name, type, fuelType, gearType, seats, pricePerDay, vendor } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (
      !name ||
      !type ||
      !fuelType ||
      !gearType ||
      !seats ||
      !pricePerDay ||
      !vendor
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        requiredFields: [
          "name",
          "type",
          "fuelType",
          "gearType",
          "seats",
          "pricePerDay",
          "vendor",
        ],
      });
    }

    const newVehicle = new Vehicle({
      name,
      type,
      fuelType,
      gearType,
      seats,
      pricePerDay,
      image,
      vendor,
    });

    await newVehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: newVehicle,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in addVehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
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
        suggestion: "Add new cars to inventory or check your filters",
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
      retrySuggestion: "Please try again in a few moments",
    });
  }
};

module.exports = {
  addVehicle,
  getCars,
};
