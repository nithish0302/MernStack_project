const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// POST /api/bookings/create
router.post("/create", bookingController.createBooking);

// GET /api/bookings/user/:userId - Get all bookings for a user
router.get("/user/:userId", bookingController.getUserBookings);

// PATCH /api/bookings/:bookingId/cancel - Cancel a booking
router.patch("/:bookingId/cancel", bookingController.cancelBooking);

module.exports = router;
