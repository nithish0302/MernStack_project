const Vendor = require("../models/vendor");
const { encrypt, decrypt } = require("../utils/encryptor");
// GET vendor profile
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    if (vendor.upiId && typeof vendor.upiId === "string") {
      try {
        vendor.upiId = decrypt(vendor.upiId);
      } catch (err) {
        console.error("Failed to decrypt UPI ID:", err.message);
        vendor.upiId = ""; // fallback to empty string if decryption fails
      }
    }

    res.status(200).json(vendor);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE vendor profile
const updateVendorProfile = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "name",
      "phone",
      "gender",
      "address",
      "city",
      "state",
      "pincode",
      "companyName",
      "aadharNumber",
      "panNumber",
      "bankAccountNumber",
      "upiId",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "gender" && typeof req.body[field] === "string") {
          updates[field] = req.body[field].toLowerCase();
        } else if (field === "upiId" && typeof req.body[field] === "string") {
          updates[field] = encrypt(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    console.log("Updating vendor with:", updates);

    const vendor = await Vendor.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: vendor,
    });
  } catch (err) {
    console.error("Error updating vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Basic ID validation
    if (!vendorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const vendor = await Vendor.findById(vendorId)
      .select("name phone companyName address upiId")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Decrypt UPI ID if it exists
    let decryptedUpi = "";
    if (vendor.upiId) {
      try {
        decryptedUpi = decrypt(vendor.upiId);
        console.log("Decrypted UPI ID:", decryptedUpi);
      } catch (err) {
        console.error("Failed to decrypt UPI ID:", err);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...vendor,
        upiId: decryptedUpi,
      },
    });
  } catch (err) {
    console.error("Error fetching vendor:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getVendorById,
};
