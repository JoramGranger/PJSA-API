const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
/* const schoolRoutes = require("./school.route"); */
const metadataRoutes = require("./metadata.route");

const router = express.Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
/* router.use("/schools", schoolRoutes); */
router.use("/metadata", metadataRoutes);

module.exports = router;