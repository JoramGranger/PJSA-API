const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema({
  name: String,
  location: String,
  box_number: String,
  email: String,
  phone: String,
  website: String,
  logo_url: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Metadata", metadataSchema);