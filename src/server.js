const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

// Initialize App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Routes Placeholder
app.get("/", (req, res) => res.send("Welcome to PJSA API"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
