// models/requirementSet.model.js
const mongoose = require("mongoose");

// Create a sub-schema for requirements with quantities
const requirementItemSchema = new mongoose.Schema({
  requirement: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Requirement",
    required: true
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0 
  }
});

const requirementSetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  // Array of objects containing requirement reference and quantity
  requirementItems: [requirementItemSchema],
  // Reference to Class model
  SchoolClass: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SchoolClass",
    required: true 
  },
  // Reference to Term model
  AcademicTerm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AcademicTerm",
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Add pre-save hook to update the updated_at field
requirementSetSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("RequirementSet", requirementSetSchema);