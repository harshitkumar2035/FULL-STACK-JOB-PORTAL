const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (!user.profile) {
      user.profile = {};
    }

    user.profile.phone = req.body.phone !== undefined ? req.body.phone : user.profile.phone;
    user.profile.location = req.body.location !== undefined ? req.body.location : user.profile.location;
    user.profile.title = req.body.title !== undefined ? req.body.title : user.profile.title;
    user.profile.bio = req.body.bio !== undefined ? req.body.bio : user.profile.bio;
    user.profile.company = req.body.company !== undefined ? req.body.company : user.profile.company;
    user.profile.companyWebsite = req.body.companyWebsite !== undefined ? req.body.companyWebsite : user.profile.companyWebsite;

    if (req.body.skills) {
      user.profile.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.file) {
      user.profile.resume = `/uploads/${req.file.filename}`;
    } else if (req.body.resume) {
      user.profile.resume = req.body.resume;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
