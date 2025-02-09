const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  box_number: String,
  email: String,
  phone: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("School", schoolSchema);