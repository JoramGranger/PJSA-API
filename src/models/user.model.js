const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "staff", "parent", "student"],
    required: true 
  },
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
