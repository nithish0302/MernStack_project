const Vehicle = require("../models/vehicle");

const addVehicle = async (req, res) => {
  try {
    const { name, type, fuelType, gearType, seats, pricePerDay, vendor } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

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
      message: "Bike added successfully",
      bike: newVehicle,
    });
  } catch (err) {
    console.error("Error in addVehicle:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addVehicle };
