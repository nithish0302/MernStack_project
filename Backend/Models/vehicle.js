const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fuelType: { type: String, required: true },
  gearType: { type: String, required: true },
  seats: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: false },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
