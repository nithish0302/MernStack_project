const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    companyName: { type: String, default: "" },
    aadharNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    bankAccountNumber: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    upiId: { type: String, default: "" },
  },
  { collection: "Vendor" }
);

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
