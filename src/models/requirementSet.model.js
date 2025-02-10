// models/requirementSet.model.js
const mongoose = require("mongoose");

const requirementSetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  requirements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Requirement" }], // Reference to the Requirement model
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RequirementSet", requirementSetSchema);