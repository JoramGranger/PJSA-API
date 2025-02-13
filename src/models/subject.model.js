// models/subject.model.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subject", subjectSchema);