const Vendor = require("../Models/vendor");

const getVendorProfile = async (req, res) => {
  try {
    if (!req.session.vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await Vendor.findById(req.session.vendorId).select(
      "-password"
    );
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    if (!req.session.vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    const vendor = await Vendor.findByIdAndUpdate(
      req.session.vendorId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
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
