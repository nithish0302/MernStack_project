const Vehicle = require("../Models/vehicle");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Helper: Validate and convert pricePerKm
const validateAndConvertPrice = (pricePerKm) => {
  const kmPrice = Number(pricePerKm);
  if (isNaN(kmPrice) || kmPrice <= 0) {
    throw new Error("Invalid pricePerKm value. Must be a positive number");
  }
  return kmPrice;
};

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      fuelType,
      gearType,
      seats,
      pricePerKm,
      vendor,
      vehicleNumber,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Required field validation
    const requiredFields = {
      name: "Name",
      type: "Type",
      fuelType: "Fuel Type",
      gearType: "Gear Type",
      seats: "Seats",
      vendor: "Vendor",
      vehicleNumber: "Vehicle Number",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !req.body[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!["Car", "Bike"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type. Must be either 'Car' or 'Bike'",
      });
    }

    // TN vehicle number regex
    const tnRegex = /^TN\s\d{2}\s[A-Z]{1,2}\s\d{4}$/i;
    if (!tnRegex.test(vehicleNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle number format. Expected: TN 01 XX 0000",
      });
    }

    // Check uniqueness
    const existing = await Vehicle.findOne({ vehicleNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Vehicle number already exists",
      });
    }

    const validatedPricePerKm = validateAndConvertPrice(pricePerKm);

    const newVehicle = new Vehicle({
      name,
      type,
      fuelType,
      gearType,
      seats: Number(seats),
      pricePerKm: validatedPricePerKm,
      image,
      vendor,
      vehicleNumber,
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
    });
  }
};

// Get all vehicles by type
const getVehiclesByType = async (type, req, res) => {
  try {
    const vehicles = await Vehicle.find({ type }).populate(
      "vendor",
      "name companyName address email phone"
    );

    if (!vehicles.length) {
      return res.status(404).json({
        success: false,
        message: `No ${type.toLowerCase()}s found in inventory`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type}s retrieved successfully`,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.error(`Error fetching ${type}:`, err);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${type}`,
    });
  }
};

const getCars = async (req, res) => await getVehiclesByType("Car", req, res);
const getBikes = async (req, res) => await getVehiclesByType("Bike", req, res);

// Get vehicles count by vendor
const getVendorVehicleCount = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
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
    });
  }
};

// Get vehicles by vendor and type
const getVehiclesByVendorAndType = async (type, req, res) => {
  try {
    const { vendorId } = req.params;

    if (!ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const vehicles = await Vehicle.find({
      type,
      vendor: vendorId,
    }).populate("vendor", "name companyName address email phone");

    if (!vehicles.length) {
      return res.status(404).json({
        success: false,
        message: `No ${type.toLowerCase()}s found for this vendor`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type}s for vendor retrieved successfully`,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.error(`Error fetching vendor ${type}:`, err);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${type} by vendor`,
    });
  }
};

const getCarsByVendor = async (req, res) =>
  await getVehiclesByVendorAndType("Car", req, res);

const getBikesByVendor = async (req, res) =>
  await getVehiclesByVendorAndType("Bike", req, res);

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    if (!ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const deleted = await Vehicle.findByIdAndDelete(vehicleId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID format",
      });
    }

    const vehicle = await Vehicle.findById(id).populate(
      "vendor",
      "name email phone"
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching vehicle",
    });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    if (updates.pricePerKm) {
      updates.pricePerKm = validateAndConvertPrice(updates.pricePerKm);
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err) {
    console.error("Error updating vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
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
  getVehicleById,
  updateVehicle,
};
