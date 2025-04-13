const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    companyName: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
    bankAccountNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Vendor" }
);

// Check if the model already exists before defining it
const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
