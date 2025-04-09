const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  available: { type: Boolean, default: true },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema, "vehicles");
