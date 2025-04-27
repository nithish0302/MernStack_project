const Vehicle = require("../models/vehicle");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Helper function to validate and convert pricing
const validateAndConvertPrice = (pricePerKm, pricePerDay) => {
  if (pricePerKm !== undefined) {
    const kmPrice = Number(pricePerKm);
    if (isNaN(kmPrice) || kmPrice <= 0) {
      throw new Error("Invalid pricePerKm value. Must be a positive number");
    }
    return kmPrice;
  }

  if (pricePerDay !== undefined) {
    const dayPrice = Number(pricePerDay);
    if (isNaN(dayPrice)) {
      throw new Error("Invalid pricePerDay value. Must be a number");
    }
    return Math.round(dayPrice / 10); // Conversion from day to km price
  }

  throw new Error("Either pricePerKm or pricePerDay must be provided");
};

const addVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      fuelType,
      gearType,
      seats,
      pricePerKm,
      pricePerDay,
      vendor,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    const requiredFields = {
      name: "Name",
      type: "Type",
      fuelType: "Fuel Type",
      gearType: "Gear Type",
      seats: "Seats",
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

    // Convert and validate price
    const validatedPricePerKm = validateAndConvertPrice(
      pricePerKm,
      pricePerDay
    );

    const newVehicle = new Vehicle({
      name,
      type,
      fuelType,
      gearType,
      seats: Number(seats),
      pricePerKm: validatedPricePerKm,
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
      message: err.message || "Failed to add vehicle",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      suggestion: "Please check the data and try again",
    });
  }
};

const getVehiclesByType = async (type, req, res) => {
  try {
    const vehicles = await Vehicle.find({ type }).populate("vendor");

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${type.toLowerCase()}s found in inventory`,
        suggestion: `Add new ${type.toLowerCase()}s to inventory`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type}s retrieved successfully`,
      count: vehicles.length,
      data: vehicles,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`Error fetching ${type.toLowerCase()}s:`, err);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${type.toLowerCase()}s`,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      retrySuggestion: "Please try again later",
    });
  }
};

const getCars = async (req, res) => await getVehiclesByType("Car", req, res);
const getBikes = async (req, res) => await getVehiclesByType("Bike", req, res);

const getVendorVehicleCount = async (req, res) => {
  try {
    const { vendorId } = req.params;

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

const getVehiclesByVendorAndType = async (type, req, res) => {
  try {
    const { vendorId } = req.params;

    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const vehicles = await Vehicle.find({
      type,
      vendor: new ObjectId(vendorId),
    }).populate("vendor", "name email phone");

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${type.toLowerCase()}s found for this vendor`,
        suggestion: `Ensure the vendor has added ${type.toLowerCase()}s`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type}s by vendor retrieved successfully`,
      count: vehicles.length,
      data: vehicles,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`Error fetching vendor ${type.toLowerCase()}s:`, err);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${type.toLowerCase()}s by vendor`,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getCarsByVendor = async (req, res) =>
  await getVehiclesByVendorAndType("Car", req, res);
const getBikesByVendor = async (req, res) =>
  await getVehiclesByVendorAndType("Bike", req, res);

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
