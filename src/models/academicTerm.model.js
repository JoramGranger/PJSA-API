const mongoose = require("mongoose");

const academicTermSchema = new mongoose.Schema({
  academic_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
  name: { type: String, required: true }, // e.g., "Term 1"
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AcademicTerm", academicTermSchema);