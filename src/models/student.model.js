// models/student.model.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Personal information
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    otherName: {
      type: String
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true
    },
    religion: {
      type: String
    },
    nationality: {
      type: String,
      default: "Ugandan"
    },
    address: {
      type: String
    },
    
    // Education identifiers
    EMISNo: {
      type: String,
      unique: true
    },
    LINNumber: {
      type: String,
      unique: true
    },
    
    // Medical information as independent fields
    disabilities: [{
      type: String
    }],
    immunized: {
      type: Boolean,
      default: false
    },
    allergies: [{
      type: String,
    }],
    
    // Document/media
    photo: {
      type: String,
      default: "",
    },
    
    // Status information
    academicStatus: {
      type: String,
      enum: ["Active", "Inactive", "Graduated", "Transferred", "Suspended"],
      default: "Active"
    },
    
    // Academic information
    currentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass"
    },
    admissionDate: {
      type: Date,
      default: Date.now
    },
    
    // Parent/guardian references
    parents: [{
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent"
      },
      relationship: {
        type: String,
        enum: ["Father", "Mother", "Guardian"]
      },
      isPrimaryContact: {
        type: Boolean,
        default: false
      }
    }],
    
    // System fields
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// Create a virtual field for full name
studentSchema.virtual('fullName').get(function() {
  if (this.otherName) {
    return `${this.firstName} ${this.otherName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are included in JSON output
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);