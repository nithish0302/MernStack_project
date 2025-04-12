// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   userName: String,
//   vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
//   vendorName: String,
//   vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
//   vehicleName: String,
//   startDate: Date,
//   endDate: Date,
//   totalAmount: Number,
//   paymentStatus: Boolean,
//   returnStatus: Boolean,
//   // Add these new fields
//   bookedName: { type: String, required: true },
//   bookedEmail: { type: String, required: true },
//   bookedPhone: { type: String, required: true },
//   bookedCity: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports =
//   mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  vendorName: { type: String, required: true },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  vehicleName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
  returnStatus: { type: Boolean, default: false },
  bookedName: { type: String, required: true },
  bookedEmail: { type: String, required: true },
  bookedPhone: { type: String, required: true },
  bookedCity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);