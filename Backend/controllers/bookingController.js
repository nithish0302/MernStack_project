const Booking = require("../models/booking");
const Vehicle = require("../models/vehicle");
const Vendor = require("../models/vendor");
const User = require("../models/user");

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

    // Validate required fields
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

    // Verify vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId).populate("vendor");
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for booking",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create new booking with statusOfVendor
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
      statusOfVendor: "pending", // New field added here
    });

    // Save the booking
    await booking.save();

    // Update vehicle availability to false
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

// Get all bookings for a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
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

  

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.error("Error in getVendorRequests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor requests",
      error: err.message,
    });
  }
};
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
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (status === "cancelled") {
      await Vehicle.findByIdAndUpdate(
        booking.vehicleId,
        { isAvailable: true },
        { new: true }
      );
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
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Vehicle.findByIdAndUpdate(
      booking.vehicleId._id,
      { isAvailable: true },
      { new: true }
    );

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
