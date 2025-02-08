const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

module.exports = router;
