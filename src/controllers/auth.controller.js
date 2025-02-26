const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, subrole } = req.body;

    // Validate inputs
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Ensure subrole is provided if role is "staff"
    if (role === "staff" && !subrole) {
      return res.status(400).json({ message: "Subrole is required for staff members" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, subrole });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, subrole: user.subrole || null }, // ✅ Include subrole in token
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, subrole: user.subrole || null }); // ✅ Send subrole in response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 LOGOUT USER (No need for token blacklist)
exports.logout = async (req, res) => {
  try {
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
