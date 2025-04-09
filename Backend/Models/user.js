const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", UserSchema, "users");
