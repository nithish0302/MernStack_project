const Vendor = require("../models/vendor");

// GET vendor profile
const getVendorProfile = async (req, res) => {
  try {
    // Get vendor ID from the decoded JWT (via middleware)
    const vendor = await Vendor.findById(req.user.id).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
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
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update vendor profile using ID from JWT
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

module.exports = {
  getVendorProfile,
  updateVendorProfile,
};
