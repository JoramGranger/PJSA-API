const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const schoolRoutes = require("./school.routes");

const router = express.Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/schools", schoolRoutes);

module.exports = router;