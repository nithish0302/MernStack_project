const Booking = require("../models/booking");
const Vehicle = require("../Models/vehicle");
const Vendor = require("../models/vendor");
const User = require("../models/user");
const mongoose = require("mongoose");

// 1. Create Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      startDate,
      endDate,
      totalAmount,
      bookedName,
      bookedEmail,
      bookedPhone,
      bookedCity,
    } = req.body;

    const requiredFields = [
      "userId",
      "vehicleId",
      "startDate",
      "endDate",
      "totalAmount",
      "bookedName",
      "bookedEmail",
      "bookedPhone",
      "bookedCity",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const vehicle = await Vehicle.findById(vehicleId).populate("vendor");
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    if (!vehicle.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for booking",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const booking = new Booking({
      userId,
      userName: user.name || bookedName,
      vendorId: vehicle.vendor._id,
      vendorName: vehicle.vendor.name,
      vehicleId: vehicle._id,
      vehicleName: vehicle.name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount,
      paymentStatus: true,
      returnStatus: false,
      bookedName,
      bookedEmail,
      bookedPhone,
      bookedCity,
      status: "ongoing",
      statusOfVendor: "pending",
    });

    await booking.save();
    vehicle.isAvailable = false;
    await vehicle.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
      error: err.message,
    });
  }
};

exports.getAllVendorBookings = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const allBookings = await Booking.find({ vendorId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("vehicleId", "name imageUrl");

    res
      .status(200)
      .json({ success: true, count: allBookings.length, data: allBookings });
  } catch (err) {
    console.error("Error in getAllVendorBookings:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all vendor bookings",
      error: err.message,
    });
  }
};

exports.getVendorRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendorId: req.params.vendorId,
      statusOfVendor: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("vehicleId", "name imageUrl");

    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error("Error in getVendorRequests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor requests",
      error: err.message,
    });
  }
};

// 5. Update Booking Status (accept/cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["accepted", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'accepted' or 'cancelled'",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { statusOfVendor: status },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (status === "cancelled") {
      await Vehicle.findByIdAndUpdate(booking.vehicleId, { isAvailable: true });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: err.message,
    });
  }
};

// 6. Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        status: "cancelled",
        statusOfVendor: "cancelled",
        paymentStatus: true,
        returnStatus: true,
      },
      { new: true }
    ).populate("vehicleId");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await Vehicle.findByIdAndUpdate(booking.vehicleId._id, {
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: err.message,
    });
  }
};

// 7. Get Vendor Previous Bookings (completed/cancelled)
exports.getVendorPreviousBookings = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const bookings = await Booking.find({
      vendorId,
      status: { $in: ["cancelled", "completed"] },
      statusOfVendor: { $ne: "pending" },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("vehicleId", "name imageUrl");

    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error("Error fetching vendor previous bookings:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor previous bookings",
      error: err.message,
    });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { afterKm, paymentMethod } = req.body;

    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }

    // Validate afterKm
    if (!afterKm || isNaN(afterKm) || afterKm <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid afterKm value. Must be a positive number",
      });
    }

    // Validate payment method
    const validPaymentMethods = ["QR", "Cash"];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(
          ", "
        )}`,
      });
    }

    // Find and validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Find and validate vehicle
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Calculate ride distance and amount
    const rideKm = afterKm - vehicle.completedKm;
    if (rideKm < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid afterKm. Cannot be less than vehicle's current KM.",
      });
    }

    const totalAmount = rideKm * vehicle.pricePerKm;

    // Update booking
    booking.statusOfVendor = "rideCompleted";
    booking.status = "completed";
    booking.paymentStatus = true;
    booking.returnStatus = true;
    booking.endDate = new Date();
    booking.totalAmount = totalAmount;
    booking.paymentMethod = paymentMethod;
    await booking.save();

    // Update vehicle
    vehicle.completedKm = afterKm;
    vehicle.isAvailable = true;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      data: {
        booking,
        rideKm,
        totalAmount,
      },
    });
  } catch (err) {
    console.error("Error completing ride:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while completing ride",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
