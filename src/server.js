const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Import and use the centralized routes
const routes = require("./routes/index");
app.use("/pjsa", routes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to PJSA API 1.0");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
