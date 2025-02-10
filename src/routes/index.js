const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
/* const schoolRoutes = require("./school.route"); */
const metadataRoutes = require("./metadata.route");
const academicYearRoutes = require("./academicYear.route");
const academicTermRoutes = require("./academicTerm.route");
const requirementRoutes = require("./requirement.route");

const router = express.Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
/* router.use("/schools", schoolRoutes); */
router.use("/metadata", metadataRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/academic-terms", academicTermRoutes);
router.use("/requirements", requirementRoutes);

module.exports = router;