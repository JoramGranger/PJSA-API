const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AcademicYear", academicYearSchema);