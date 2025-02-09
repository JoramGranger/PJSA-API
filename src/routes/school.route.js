const express = require("express");
const {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} = require("../controllers/school.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");

const router = express.Router();

// Only admins can create, update, or delete schools
router.post("/", authenticate, authorizeRole(["admin"]), createSchool);
router.get("/", authenticate, getSchools);
router.get("/:id", authenticate, getSchoolById);
router.put("/:id", authenticate, authorizeRole(["admin"]), updateSchool);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteSchool);

module.exports = router;
