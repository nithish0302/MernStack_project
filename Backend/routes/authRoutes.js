const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/authController");


router.post("/signup", signup);
router.post("/signin", signin);

router.get("/test", (req, res) => {
  res.send("Auth route is working!");
});

module.exports = router;
