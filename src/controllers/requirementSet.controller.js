// controllers/requirementSet.controller.js
const RequirementSet = require('../models/requirementSet.model');
const Requirement = require('../models/requirement.model');
const SchoolClass = require('../models/class.model');
const AcademicTerm = require('../models/academicTerm.model');

// Create a new RequirementSet
async function createRequirementSet(req, res) {
  try {
    const { name, description, requirementItems, SchoolClass: SchoolClassId, AcademicTerm: AcademicTermId } = req.body;

    // Validate that the SchoolClass exists
    const SchoolClassExists = await SchoolClass.findById(SchoolClassId);
    if (!SchoolClassExists) {
      return res.status(400).json({ message: 'SchoolClass not found' });
    }

    // Validate that the AcademicTerm exists
    const AcademicTermExists = await AcademicTerm.findById(AcademicTermId);
    if (!AcademicTermExists) {
      return res.status(400).json({ message: 'AcademicTerm not found' });
    }

    // Extract requirement IDs for validation
    const requirementIds = requirementItems.map(item => item.requirement);

    // Validate that all requirements exist
    const validRequirements = await Requirement.find({ '_id': { $in: requirementIds } });
    if (validRequirements.length !== requirementIds.length) {
      return res.status(400).json({ message: 'Some requirements are invalid' });
    }

    // Create a new RequirementSet
    const requirementSet = new RequirementSet({
      name,
      description,
      requirementItems,
      SchoolClass: SchoolClassId,
      AcademicTerm: AcademicTermId
    });

    await requirementSet.save();
    res.status(201).json({ message: 'Requirement Set created successfully', data: requirementSet });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Requirement Set', error: error.message });
  }
}

// Get all RequirementSets
async function getAllRequirementSets(req, res) {
  try {
    const requirementSets = await RequirementSet.find()
      .populate('SchoolClass')
      .populate('AcademicTerm')
      .populate({
        path: 'requirementItems.requirement',
        select: 'name description unit'
      });
    res.status(200).json(requirementSets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Requirement Sets', error: error.message });
  }
}

// Get a RequirementSet by ID
async function getRequirementSetById(req, res) {
  try {
    const requirementSet = await RequirementSet.findById(req.params.id)
      .populate('SchoolClass')
      .populate('AcademicTerm')
      .populate({
        path: 'requirementItems.requirement',
        select: 'name description unit'
      });
    
    if (!requirementSet) {
      return res.status(404).json({ message: 'Requirement Set not found' });
    }
    res.status(200).json(requirementSet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Requirement Set', error: error.message });
  }
}

// Update a RequirementSet by ID
async function updateRequirementSet(req, res) {
  try {
    const { name, description, requirementItems, SchoolClass: SchoolClassId, AcademicTerm: AcademicTermId } = req.body;

    // Validate that the SchoolClass exists
    if (SchoolClassId) {
      const SchoolClassExists = await SchoolClass.findById(SchoolClassId);
      if (!SchoolClassExists) {
        return res.status(400).json({ message: 'SchoolClass not found' });
      }
    }

    // Validate that the AcademicTerm exists
    if (AcademicTermId) {
      const AcademicTermExists = await AcademicTerm.findById(AcademicTermId);
      if (!AcademicTermExists) {
        return res.status(400).json({ message: 'AcademicTerm not found' });
      }
    }

    // Validate requirements if they are being updated
    if (requirementItems) {
      // Extract requirement IDs for validation
      const requirementIds = requirementItems.map(item => item.requirement);
      
      // Validate that all requirements exist
      const validRequirements = await Requirement.find({ '_id': { $in: requirementIds } });
      if (validRequirements.length !== requirementIds.length) {
        return res.status(400).json({ message: 'Some requirements are invalid' });
      }
    }

    // Create update object with only provided fields
    const updateObj = {};
    if (name) updateObj.name = name;
    if (description) updateObj.description = description;
    if (requirementItems) updateObj.requirementItems = requirementItems;
    if (SchoolClassId) updateObj.SchoolClass = SchoolClassId;
    if (AcademicTermId) updateObj.AcademicTerm = AcademicTermId;
    updateObj.updated_at = Date.now();

    const requirementSet = await RequirementSet.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    if (!requirementSet) {
      return res.status(404).json({ message: 'Requirement Set not found' });
    }

    res.status(200).json({ message: 'Requirement Set updated successfully', data: requirementSet });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Requirement Set', error: error.message });
  }
}

// Delete a RequirementSet by ID
async function deleteRequirementSet(req, res) {
  try {
    const requirementSet = await RequirementSet.findByIdAndDelete(req.params.id);
    if (!requirementSet) {
      return res.status(404).json({ message: 'Requirement Set not found' });
    }
    res.status(200).json({ message: 'Requirement Set deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Requirement Set', error: error.message });
  }
}

module.exports = {
  createRequirementSet,
  getAllRequirementSets,
  getRequirementSetById,
  updateRequirementSet,
  deleteRequirementSet
};