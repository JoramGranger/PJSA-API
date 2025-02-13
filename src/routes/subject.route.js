// routes/subject.routes.js
const express = require("express");
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require("../controllers/subject.controller");

// Middleware for authentication and authorization
const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");

router.post("/", authenticate, authorizeRole(["admin"]), createSubject);
router.get("/", authenticate, getAllSubjects);
router.get("/:id", authenticate, getSubjectById);
router.put("/:id", authenticate, authorizeRole(["admin"]), updateSubject);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteSubject);

module.exports = router;