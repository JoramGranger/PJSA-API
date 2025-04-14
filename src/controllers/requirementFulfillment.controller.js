// controllers/requirementFulfillment.controller.js
const RequirementFulfillment = require('../models/requirementFulfillment.model');
const RequirementSet = require('../models/requirementSet.model');
const Student = require('../models/student.model');

// Create a new requirement fulfillment record
async function createRequirementFulfillment(req, res) {
  try {
    const { 
      studentId, 
      requirementSetId, 
      fulfillmentDate, 
      fulfilledItems, 
      receiptNumber, 
      notes 
    } = req.body;
    
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Verify requirement set exists
    const requirementSet = await RequirementSet.findById(requirementSetId)
      .populate('requirementItems.requirement');
    if (!requirementSet) {
      return res.status(404).json({ message: 'Requirement set not found' });
    }
    
    // Check if a fulfillment already exists for this student and requirement set
    const existingFulfillment = await RequirementFulfillment.findOne({
      student: studentId,
      requirementSet: requirementSetId
    });
    
    if (existingFulfillment) {
      return res.status(409).json({ 
        message: 'A fulfillment record already exists for this student and requirement set',
        data: existingFulfillment
      });
    }
    
    // Create initial fulfillment from the requirement set
    let fulfillment;
    
    if (fulfilledItems) {
      // If fulfilled items are provided, use them and calculate balance for each
      const processedItems = fulfilledItems.map(item => {
        // Find the required quantity from the requirement set
        const reqItem = requirementSet.requirementItems.find(
          ri => ri.requirement._id.toString() === item.requirement.toString()
        );
        
        const requiredQuantity = reqItem ? reqItem.quantity : item.requiredQuantity;
        const balance = requiredQuantity - item.fulfilledQuantity;
        
        return {
          ...item,
          requiredQuantity,
          balance
        };
      });
      
      fulfillment = new RequirementFulfillment({
        student: studentId,
        requirementSet: requirementSetId,
        SchoolClass: requirementSet.SchoolClass,
        AcademicTerm: requirementSet.AcademicTerm,
        fulfillmentDate: fulfillmentDate || new Date(),
        fulfilledItems: processedItems,
        receiptNumber,
        notes,
        recordedBy: req.user._id // Assuming user info is in the request
      });
    } else {
      // Otherwise create from the requirement set template
      fulfillment = await RequirementFulfillment.createFromRequirementSet(
        studentId,
        requirementSetId,
        req.user._id,
        fulfillmentDate
      );
      
      // Add optional fields
      fulfillment.receiptNumber = receiptNumber;
      fulfillment.notes = notes;
    }
    
    await fulfillment.save();
    
    res.status(201).json({ 
      message: 'Requirement fulfillment created successfully', 
      data: fulfillment 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating requirement fulfillment', 
      error: error.message 
    });
  }
}

// Get all requirement fulfillments
async function getAllRequirementFulfillments(req, res) {
  try {
    const fulfillments = await RequirementFulfillment.find()
      .populate('student', 'firstName lastName otherName')
      .populate('requirementSet', 'name')
      .populate('SchoolClass', 'name')
      .populate('AcademicTerm', 'name')
      .populate('fulfilledItems.requirement')
      .populate('recordedBy', 'fullName');
    
    res.status(200).json(fulfillments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching requirement fulfillments', 
      error: error.message 
    });
  }
}

// Get requirement fulfillment by ID
async function getRequirementFulfillmentById(req, res) {
  try {
    const fulfillment = await RequirementFulfillment.findById(req.params.id)
      .populate('student', 'firstName lastName otherName')
      .populate('requirementSet')
      .populate('SchoolClass', 'name')
      .populate('AcademicTerm', 'name')
      .populate('fulfilledItems.requirement')
      .populate('recordedBy', 'fullName');
    
    if (!fulfillment) {
      return res.status(404).json({ message: 'Requirement fulfillment not found' });
    }
    
    res.status(200).json(fulfillment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching requirement fulfillment', 
      error: error.message 
    });
  }
}

// Update requirement fulfillment
async function updateRequirementFulfillment(req, res) {
  try {
    const { fulfilledItems, receiptNumber, notes, fulfillmentDate } = req.body;
    
    // Find the fulfillment
    const fulfillment = await RequirementFulfillment.findById(req.params.id)
      .populate('requirementSet');
      
    if (!fulfillment) {
      return res.status(404).json({ message: 'Requirement fulfillment not found' });
    }
    
    // Update the fulfillment fields
    if (fulfilledItems) {
      // For each fulfilled item, update the quantity and recalculate the balance
      for (const updatedItem of fulfilledItems) {
        const existingItem = fulfillment.fulfilledItems.find(
          item => item.requirement.toString() === updatedItem.requirement.toString()
        );
        
        if (existingItem) {
          existingItem.fulfilledQuantity = updatedItem.fulfilledQuantity;
          // Balance will be auto-calculated in the pre-save hook
          if (updatedItem.notes) {
            existingItem.notes = updatedItem.notes;
          }
        } else {
          // If it's a new item, verify it belongs to the requirement set
          const requirementInSet = fulfillment.requirementSet.requirementItems.some(
            item => item.requirement.toString() === updatedItem.requirement.toString()
          );
          
          if (!requirementInSet) {
            return res.status(400).json({ 
              message: `Requirement ${updatedItem.requirement} is not part of this requirement set` 
            });
          }
          
          // Find the required quantity from the requirement set
          const reqItem = fulfillment.requirementSet.requirementItems.find(
            item => item.requirement.toString() === updatedItem.requirement.toString()
          );
          
          const requiredQuantity = reqItem ? reqItem.quantity : 0;
          
          // Add the new item with calculated balance
          fulfillment.fulfilledItems.push({
            requirement: updatedItem.requirement,
            requiredQuantity,
            fulfilledQuantity: updatedItem.fulfilledQuantity,
            balance: requiredQuantity - updatedItem.fulfilledQuantity,
            notes: updatedItem.notes || ''
          });
        }
      }
    }
    
    if (receiptNumber) fulfillment.receiptNumber = receiptNumber;
    if (notes) fulfillment.notes = notes;
    if (fulfillmentDate) fulfillment.fulfillmentDate = fulfillmentDate;
    
    // Save the updated fulfillment
    await fulfillment.save();
    
    res.status(200).json({ 
      message: 'Requirement fulfillment updated successfully', 
      data: fulfillment 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating requirement fulfillment', 
      error: error.message 
    });
  }
}

// Delete requirement fulfillment
async function deleteRequirementFulfillment(req, res) {
  try {
    const fulfillment = await RequirementFulfillment.findByIdAndDelete(req.params.id);
    
    if (!fulfillment) {
      return res.status(404).json({ message: 'Requirement fulfillment not found' });
    }
    
    res.status(200).json({ message: 'Requirement fulfillment deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting requirement fulfillment', 
      error: error.message 
    });
  }
}

// Get all fulfillments for a student
async function getStudentFulfillments(req, res) {
  try {
    const { studentId } = req.params;
    
    const fulfillments = await RequirementFulfillment.find({ student: studentId })
      .populate('requirementSet', 'name description')
      .populate('SchoolClass', 'name')
      .populate('AcademicTerm', 'name')
      .populate('fulfilledItems.requirement')
      .sort({ fulfillmentDate: -1 });
    
    res.status(200).json(fulfillments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching student fulfillments', 
      error: error.message 
    });
  }
}

// Get all fulfillments for a requirement set
async function getRequirementSetFulfillments(req, res) {
  try {
    const { requirementSetId } = req.params;
    
    const fulfillments = await RequirementFulfillment.find({ requirementSet: requirementSetId })
      .populate('student', 'firstName lastName otherName')
      .populate('fulfilledItems.requirement')
      .sort({ fulfillmentDate: -1 });
    
    res.status(200).json(fulfillments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching requirement set fulfillments', 
      error: error.message 
    });
  }
}

// Get fulfillment by student and requirement set
async function getStudentRequirementSetFulfillment(req, res) {
  try {
    const { studentId, requirementSetId } = req.params;
    
    const fulfillment = await RequirementFulfillment.findOne({
      student: studentId,
      requirementSet: requirementSetId
    })
      .populate('student', 'firstName lastName otherName')
      .populate('requirementSet')
      .populate('SchoolClass', 'name')
      .populate('AcademicTerm', 'name')
      .populate('fulfilledItems.requirement')
      .populate('recordedBy', 'fullName');
    
    if (!fulfillment) {
      return res.status(404).json({ 
        message: 'No fulfillment found for this student and requirement set' 
      });
    }
    
    res.status(200).json(fulfillment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching fulfillment', 
      error: error.message 
    });
  }
}

// Update individual fulfillment items
async function updateFulfillmentItems(req, res) {
  try {
    const { fulfillmentId } = req.params;
    const { fulfilledItems, notes } = req.body;
    
    const fulfillment = await RequirementFulfillment.findById(fulfillmentId);
    if (!fulfillment) {
      return res.status(404).json({ message: 'Requirement fulfillment not found' });
    }
    
    // Update each fulfilled item
    if (fulfilledItems && fulfilledItems.length > 0) {
      for (const updatedItem of fulfilledItems) {
        const existingItem = fulfillment.fulfilledItems.find(
          item => item.requirement.toString() === updatedItem.requirement.toString()
        );
        
        if (existingItem) {
          existingItem.fulfilledQuantity = updatedItem.fulfilledQuantity;
          // Balance will be auto-calculated in the pre-save hook
          if (updatedItem.notes) {
            existingItem.notes = updatedItem.notes;
          }
        }
      }
    }
    
    // Update general notes if provided
    if (notes) {
      fulfillment.notes = notes;
    }
    
    await fulfillment.save();
    
    res.status(200).json({ 
      message: 'Fulfillment items updated successfully', 
      data: fulfillment 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating fulfillment items', 
      error: error.message 
    });
  }
}

// Get fulfillments by class
async function getFulfillmentsByClass(req, res) {
  try {
    const { classId } = req.params;
    
    const fulfillments = await RequirementFulfillment.find({ SchoolClass: classId })
      .populate('student', 'firstName lastName otherName')
      .populate('requirementSet', 'name')
      .populate('AcademicTerm', 'name')
      .sort({ fulfillmentDate: -1 });
    
    res.status(200).json(fulfillments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching fulfillments by class', 
      error: error.message 
    });
  }
}

// Get fulfillments by term
async function getFulfillmentsByTerm(req, res) {
  try {
    const { termId } = req.params;
    
    const fulfillments = await RequirementFulfillment.find({ AcademicTerm: termId })
      .populate('student', 'firstName lastName otherName')
      .populate('requirementSet', 'name')
      .populate('SchoolClass', 'name')
      .sort({ fulfillmentDate: -1 });
    
    res.status(200).json(fulfillments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching fulfillments by term', 
      error: error.message 
    });
  }
}

// Get requirement fulfillment summary stats
async function getRequirementFulfillmentStats(req, res) {
  try {
    const { requirementSetId } = req.params;
    
    // Get the requirement set to know total students
    const requirementSet = await RequirementSet.findById(requirementSetId);
    if (!requirementSet) {
      return res.status(404).json({ message: 'Requirement set not found' });
    }
    
    // Find students in this class
    const students = await Student.find({ 
      currentClass: requirementSet.SchoolClass,
      academicStatus: "Active"
    });
    
    const totalStudents = students.length;
    
    // Get fulfillments for this requirement set
    const fulfillments = await RequirementFulfillment.find({ requirementSet: requirementSetId });
    
    // Calculate statistics
    const stats = {
      totalStudents,
      totalFulfillments: fulfillments.length,
      completeFulfillments: fulfillments.filter(f => f.status === "Complete").length,
      partialFulfillments: fulfillments.filter(f => f.status === "Partial").length,
      incompleteFulfillments: fulfillments.filter(f => f.status === "Incomplete").length,
      studentsWithNoRecord: totalStudents - fulfillments.length,
      fulfillmentRate: totalStudents > 0 ? (fulfillments.length / totalStudents) * 100 : 0,
      completeRate: totalStudents > 0 ? 
        (fulfillments.filter(f => f.status === "Complete").length / totalStudents) * 100 : 0,
      // Add total balance across all fulfillments
      totalOutstandingItems: fulfillments.reduce((total, f) => {
        return total + f.totalBalance;
      }, 0)
    };
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching requirement fulfillment statistics', 
      error: error.message 
    });
  }
}

module.exports = {
  createRequirementFulfillment,
  getAllRequirementFulfillments,
  getRequirementFulfillmentById,
  updateRequirementFulfillment,
  deleteRequirementFulfillment,
  getStudentFulfillments,
  getRequirementSetFulfillments,
  getStudentRequirementSetFulfillment,
  updateFulfillmentItems,
  getFulfillmentsByClass,
  getFulfillmentsByTerm,
  getRequirementFulfillmentStats
};