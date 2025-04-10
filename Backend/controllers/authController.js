const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Vendor = require("../models/vendor");
const Admin = require("../models/admin");

const getCollection = (role) => {
  switch (role.toLowerCase()) {
    case "vendor":
      return Vendor;
    case "admin":
      return Admin;
    default:
      return User;
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const Collection = getCollection(role);

    const existingUser = await Collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new Collection({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Collection = getCollection(role);
    console.log(email, password, role);
    const user = await Collection.findOne({ email });
    // console.log(user);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, "jwt_secret", {
      expiresIn: "1h",
    });
    console.log(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log(user._id);
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
