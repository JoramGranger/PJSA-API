// models/schoolfees.model.js
const mongoose = require("mongoose");

const schoolFeesSchema = new mongoose.Schema(
  {
    student: {  // Changed from studentName to student
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    
    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true
    },
    
    studentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true
    },
    
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    
    bf: {
      type: Date,
      default: Date.now // Fixed: Changed from Date.now to 0
    },
    
    amount: {
      type: Number,
      required: true
    },
    
    rn: {
      type: String
    },
    
    bal: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { 
    timestamps: true 
  }
);

// Simple indexes
schoolFeesSchema.index({ student: 1, academicTerm: 1, date: 1 });

// Get student transactions with populated student data
schoolFeesSchema.statics.getStudentTransactions = function(studentId, termId) {  // Fixed typo
  return this.find({ 
    student: studentId, 
    academicTerm: termId 
  })
  .populate('student', 'firstName lastName otherName fullName')
  .sort({ date: 1 });
};

// Get all transactions with student names populated
schoolFeesSchema.statics.getAllTransactionsWithStudents = function(filter = {}) {  // Fixed method name
  return this.find(filter)
    .populate('student', 'firstName lastName otherName fullName')
    .populate('academicTerm', 'name')
    .populate('studentClass', 'name')
    .sort({ date: -1 });
};

// Get current balance
schoolFeesSchema.statics.getCurrentBalance = async function(studentId, termId) {  // Fixed: Use consistent schema name
  const lastTransaction = await this.findOne({
    student: studentId,
    academicTerm: termId
  }).sort({ date: -1 });
  
  return lastTransaction ? lastTransaction.bal : 0;
};

module.exports = mongoose.model("SchoolFees", schoolFeesSchema);  // Fixed: Use correct schema variable
