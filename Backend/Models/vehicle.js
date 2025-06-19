const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  fuelType: { type: String, required: true },
  gearType: { type: String, required: true },
  seats: { type: Number, required: true },
  pricePerKm: {
    type: Number,
    required: true,
    min: 1,
  },
  image: { type: String, required: false },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  make: { type: String, required: false },

  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^TN\s+\d{2}\s+[A-Z]{1,2}\s+\d{4}$/i,
  },
});

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
