const express = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
/* const schoolRoutes = require("./school.route"); */
const metadataRoutes = require("./metadata.route");
const academicYearRoutes = require("./academicYear.route");
const academicTermRoutes = require("./academicTerm.route");
const requirementRoutes = require("./requirement.route");
const requirementSetRoutes = require("./requirementSet.route");
const sujectRoutes = require("./subject.route");
const classRoutes = require("./class.route");
const studentRoutes = require("./student.route");
const parentRoutes = require("./parent.route");
const staffRoutes = require("./staff.route");
const requirementFulfillmentRoutes = require("./requirementFulfillment.route");
const schoolFeesRoutes = require("./schoolfees.route");
const router = express.Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
/* router.use("/schools", schoolRoutes); */
router.use("/metadata", metadataRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/academic-terms", academicTermRoutes);
router.use("/requirements", requirementRoutes);
router.use("/requirement-sets", requirementSetRoutes);
router.use("/subjects", sujectRoutes);
router.use("/classes", classRoutes);
router.use("/students", studentRoutes);
router.use("/parents", parentRoutes);
router.use("/staff", staffRoutes);
router.use("/requirement-fulfillments", requirementFulfillmentRoutes);
router.use("/school-fees", schoolFeesRoutes);

// Catch-all route for undefined paths
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;