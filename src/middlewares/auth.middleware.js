const jwt = require("jsonwebtoken");
require("dotenv").config();

let tokenBlacklist = new Set(); // Shared in-memory blacklist

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  const actualToken = token.split(" ")[1];

  // Check if token is blacklisted
  if (tokenBlacklist.has(actualToken)) {
    return res.status(401).json({ message: "Token is invalid (Logged out)" });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

/* exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}; */

exports.authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Unauthorized" });
  next();
};