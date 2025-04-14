// models/requirementFulfillment.model.js
const mongoose = require("mongoose");

// Create a sub-schema for fulfilled requirement items
const fulfilledItemSchema = new mongoose.Schema({
  // Reference to the requirement
  requirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Requirement",
    required: true
  },
  // Quantity required (from requirement set)
  requiredQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  // Quantity fulfilled
  fulfilledQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  // Balance (required - fulfilled)
  balance: {
    type: Number,
    default: function() {
      return this.requiredQuantity - this.fulfilledQuantity;
    }
  },
  // Notes or comments about this specific fulfillment
  notes: {
    type: String,
    default: ""
  }
});

// Add pre-save middleware to calculate balance
fulfilledItemSchema.pre('save', function(next) {
  this.balance = this.requiredQuantity - this.fulfilledQuantity;
  next();
});

const requirementFulfillmentSchema = new mongoose.Schema(
  {
    // Student who is fulfilling the requirements
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    
    // Reference to the requirement set
    requirementSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequirementSet",
      required: true
    },
    
    // Academic class reference (for quick filtering)
    SchoolClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass"
    },
    
    // Academic term reference (for quick filtering)
    AcademicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm"
    },
    
    // Date of fulfillment
    fulfillmentDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    
    // Array of fulfilled requirement items
    fulfilledItems: [fulfilledItemSchema],
    
    // Payment receipt or reference number if applicable
    receiptNumber: {
      type: String
    },
    
    // Overall fulfillment status
    status: {
      type: String,
      enum: ["Incomplete", "Partial", "Complete"],
      default: "Incomplete"
    },
    
    // Additional notes
    notes: {
      type: String
    },
    
    // Reference to staff who recorded this fulfillment
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    }
  },
  { timestamps: true }
);

// Pre-save hook to calculate fulfillment status
requirementFulfillmentSchema.pre('save', function(next) {
  // Initialize counts
  let totalRequirements = this.fulfilledItems.length;
  let completeCount = 0;
  let partialCount = 0;
  
  // Check each item
  this.fulfilledItems.forEach(item => {
    if (item.fulfilledQuantity >= item.requiredQuantity) {
      completeCount++;
    } else if (item.fulfilledQuantity > 0) {
      partialCount++;
    }
    
    // Ensure each item's balance is calculated
    item.balance = item.requiredQuantity - item.fulfilledQuantity;
  });
  
  // Determine overall status
  if (completeCount === totalRequirements) {
    this.status = "Complete";
  } else if (completeCount > 0 || partialCount > 0) {
    this.status = "Partial";
  } else {
    this.status = "Incomplete";
  }
  
  next();
});

// Virtual for total balance (sum of all item balances)
requirementFulfillmentSchema.virtual('totalBalance').get(function() {
  return this.fulfilledItems.reduce((total, item) => {
    return total + item.balance;
  }, 0);
});

// Ensure virtual fields are included in JSON output
requirementFulfillmentSchema.set('toJSON', { virtuals: true });
requirementFulfillmentSchema.set('toObject', { virtuals: true });

// Method to create a fulfillment record from a requirement set
requirementFulfillmentSchema.statics.createFromRequirementSet = async function(
  studentId, 
  requirementSetId, 
  staffId, 
  fulfillmentDate = new Date()
) {
  const RequirementSet = mongoose.model('RequirementSet');
  
  // Get the requirement set
  const requirementSet = await RequirementSet.findById(requirementSetId)
    .populate('requirementItems.requirement');
  
  if (!requirementSet) {
    throw new Error('Requirement set not found');
  }
  
  // Initialize fulfilled items array
  const fulfilledItems = requirementSet.requirementItems.map(item => ({
    requirement: item.requirement._id,
    requiredQuantity: item.quantity,
    fulfilledQuantity: 0, // Initially set to 0
    balance: item.quantity, // Initial balance is equal to the required quantity
    notes: ''
  }));
  
  // Create a new fulfillment record
  return this.create({
    student: studentId,
    requirementSet: requirementSetId,
    SchoolClass: requirementSet.SchoolClass,
    AcademicTerm: requirementSet.AcademicTerm,
    fulfillmentDate,
    fulfilledItems,
    status: "Incomplete",
    recordedBy: staffId
  });
};

module.exports = mongoose.model("RequirementFulfillment", requirementFulfillmentSchema);