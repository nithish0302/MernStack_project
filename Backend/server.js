const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const vehicleSchema = new mongoose.Schema({
  name: String,
  fuelType: String,
  gearType: String,
  seats: Number,
  pricePerDay: Number,
  image: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

app.post("/api/bikes", upload.single("image"), async (req, res) => {
  try {
    const { name, fuelType, gearType, seats, pricePerDay } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newVehicle = new Vehicle({
      name,
      fuelType,
      gearType,
      seats,
      pricePerDay,
      image,
    });

    await newVehicle.save();
    res.status(201).json({
      message: "Bike added successfully",
      bike: newVehicle,
    });
  } catch (err) {
    console.error("Error in /api/bikes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/auth", authRoutes);

const MONGO_URL = "mongodb://127.0.0.1:27017/bikerental";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected to 'bikerental'"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

const PORT = 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
