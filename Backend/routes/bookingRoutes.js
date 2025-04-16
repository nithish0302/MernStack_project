const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/create", bookingController.createBooking);
router.get("/user/:userId", bookingController.getUserBookings);
router.patch("/user/:bookingId/cancel", bookingController.cancelBooking);

router.get("/vendor/:vendorId/requests", bookingController.getVendorRequests);
router.patch(
  "/vendor/:bookingId/status",
  bookingController.updateBookingStatus
);



module.exports = router;
