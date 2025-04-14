// models/parent.model.js
const mongoose = require("mongoose");
const parentSchema = new mongoose.Schema(
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
    occupation: { 
      type: String 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String 
    },
    address: { 
      type: String 
    },
    nationality: { 
      type: String, 
      default: "Ugandan" 
    },
    
    // Documentation
    photo: { 
      type: String,
      default: ""
    }, // URL to photo
    idDocument: { 
      type: String,
      default: ""
    }, // URL to ID or passport document
    
    // Relationship to student
    relationship: {
      type: String,
      enum: ["Father", "Mother", "Guardian"],
      required: true
    },
    
    // Guardian-specific field for non-parent guardians
    guardianRelationship: { 
      type: String,
      required: function() { 
        return this.relationship === "Guardian"; 
      }
    },
    
    // Link to students
    students: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student"
    }],
    
    // Additional contact information
    alternatePhone: { 
      type: String,
      default: "" 
    },
    
    // Align with student model's isPrimaryContact
    isPrimaryContact: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);