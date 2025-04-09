const express = require("express");
const router = express.Router();
const Vehicle = require("../Models/vehicle");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can add vehicles" });
    }

    const newVehicle = new Vehicle({ ...req.body, vendorId: req.user._id });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: "Error adding vehicle" });
  }
});

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching vehicles" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can update vehicles" });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle || vehicle.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Error updating vehicle" });
  }
});

module.exports = router;
