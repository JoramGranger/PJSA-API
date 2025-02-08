const express = require("express");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, authorizeRole(["admin"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteUser);

module.exports = router;