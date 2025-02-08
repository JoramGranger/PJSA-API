const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

const router = express.Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;