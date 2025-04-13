const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// User routes
router.post("/create", bookingController.createBooking);
router.get("/user/:userId", bookingController.getUserBookings);
router.patch("/user/:bookingId/cancel", bookingController.cancelBooking);

// Vendor routes
router.get("/vendor/:vendorId/requests", bookingController.getVendorRequests);
router.patch(
  "/vendor/:bookingId/status",
  bookingController.updateBookingStatus
);

// Admin routes (if needed in future)
// router.get("/", bookingController.getAllBookings);

module.exports = router;
