const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create a model based on the schema
module.exports = mongoose.model('Requirement', requirementSchema);