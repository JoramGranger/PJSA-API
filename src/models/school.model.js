const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  box_number: String,
  email: String,
  phone: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("meta", metaSchema);