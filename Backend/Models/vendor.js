const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
});

module.exports = mongoose.model("Vendor", VendorSchema, "Vendor");
