// models/staff.model.js
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    // Basic information
    fullName: { 
      type: String, 
      required: true 
    },
    NIN: { 
      type: String, 
      required: true 
    }, // National Identification Number
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    
    // Contact information
    phone: { 
      type: String, 
      required: true 
    },
    alternatePhone: { 
      type: String 
    },
    email: { 
      type: String, 
      required: true,
      unique: true
    },
    address: { 
      type: String 
    },
    nationality: { 
      type: String, 
      default: "Ugandan" 
    },
    
    // Professional information
    department: {
      type: String
    },
    qualifications: {
      type: [String]
    },
    employmentDate: {
      type: Date
    },
    employmentStatus: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Probation"],
      default: "Full-time"
    },
    
    // Documentation
    photo: { 
      type: String,
      default: "", 
    }, // URL to photo
    idDocument: { 
      type: String,
      default: "", 
    }, // URL to ID or passport document
    
    // For teachers only
    subjects: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Subject" 
    }],
    classes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "SchoolClass" 
    }],
    
    // Emergency contact
    emergencyContactName: {
      type: String
    },
    emergencyContactPhone: {
      type: String
    },
    emergencyContactRelationship: {
      type: String
    },
    
    // System access
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Link to user account
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);