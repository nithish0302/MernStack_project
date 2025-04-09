const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Booking", BookingSchema, "Rental Collection");
