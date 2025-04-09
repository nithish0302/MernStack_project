const express = require("express");
const router = express.Router();
const Booking = require("../Models/booking");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({ ...req.body, userId: req.user._id });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Error creating booking" });
  }
});

router.get("/vendor", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Not a vendor" });
    }

    const bookings = await Booking.find({ vendorId: req.user._id }).populate(
      "vehicleId"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

module.exports = router;
