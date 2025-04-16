const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/profile", authMiddleware, userController.getUserProfile);
router.patch("/profile", authMiddleware, userController.updateUserProfile);

module.exports = router;
