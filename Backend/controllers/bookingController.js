// const Booking = require("../models/booking");
// const Vehicle = require("../models/vehicle");
// const Vendor = require("../models/vendor");
// const User = require("../models/user");

// exports.createBooking = async (req, res) => {
//   try {
//     const {
//       userId,
//       vehicleId,
//       startDate,
//       endDate,
//       totalAmount,
//       bookedName,
//       bookedEmail,
//       bookedPhone,
//       bookedCity,
//     } = req.body;

//     // Validate required fields
//     const requiredFields = [
//       "userId",
//       "vehicleId",
//       "startDate",
//       "endDate",
//       "totalAmount",
//       "bookedName",
//       "bookedEmail",
//       "bookedPhone",
//       "bookedCity",
//     ];
//     const missingFields = requiredFields.filter((field) => !req.body[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     // Verify vehicle exists
//     const vehicle = await Vehicle.findById(vehicleId).populate("vendor");
//     if (!vehicle) {
//       return res.status(404).json({
//         success: false,
//         message: "Vehicle not found",
//       });
//     }

//     // Verify user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Create new booking
//     const booking = new Booking({
//       userId,
//       userName: user.name || bookedName, // Fallback to bookedName if user.name doesn't exist
//       vendorId: vehicle.vendor._id,
//       vendorName: vehicle.vendor.name,
//       vehicleId: vehicle._id,
//       vehicleName: vehicle.name,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       totalAmount,
//       paymentStatus: true, // For demo purposes
//       returnStatus: false,
//       bookedName,
//       bookedEmail,
//       bookedPhone,
//       bookedCity,
//     });

//     await booking.save();

//     return res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       booking,
//     });
//   } catch (error) {
//     console.error("Booking creation error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create booking",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
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
