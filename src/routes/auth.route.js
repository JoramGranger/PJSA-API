const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

module.exports = router;
