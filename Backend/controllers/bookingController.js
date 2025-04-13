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

    // Create new booking
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
    }); // Sort by newest first

    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map((booking) => ({
      _id: booking._id,
      vehicleName: booking.vehicleName,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      status: booking.status,
      createdAt: booking.createdAt,
      // Include any other fields your frontend needs
      bookedName: booking.bookedName,
      bookedPhone: booking.bookedPhone,
    }));

    res.status(200).json(transformedBookings);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    // First update the booking status
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        status: "cancelled",
        paymentStatus: true, // Changed to true
        returnStatus: true, // Changed to true
      },
      { new: true }
    ).populate("vehicleId"); // Populate vehicle data

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    // Then update the vehicle availability
    await Vehicle.findByIdAndUpdate(
      booking.vehicleId._id,
      { isAvailable: true },
      { new: true }
    );

    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};