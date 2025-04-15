const Vehicle = require("../models/vehicle");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

const getVendorVehicleCount = async (req, res) => {
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
};
// Get cars by vendor ID
const getCarsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }
    // console.log("hi bro");
    const cars = await Vehicle.find({
      type: "Car",
      vendor: new ObjectId(vendorId),
    }).populate("vendor", "name email phone");

    if (!cars || cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found for this vendor",
        suggestion: "Ensure the vendor has added cars",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cars by vendor retrieved successfully",
      count: cars.length,
      data: cars,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching vendor cars:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cars by vendor",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
const getBikesByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const bikes = await Vehicle.find({
      type: "Bike",
      vendor: new ObjectId(vendorId),
    }).populate("vendor", "name email phone");

    if (!bikes || bikes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bikes found for this vendor",
        suggestion: "Ensure the vendor has added bikes",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bikes by vendor retrieved successfully",
      count: bikes.length,
      data: bikes,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching vendor bikes:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bikes by vendor",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    if (!ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID format",
      });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!deletedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: deletedVehicle,
    });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  addVehicle,
  getCars,
  getBikes,
  getVendorVehicleCount,
  getCarsByVendor,
  getBikesByVendor,
  deleteVehicle,
};
