// controllers/requirementSet.controller.js
const RequirementSet = require('../models/requirementSet.model');
const Requirement = require('../models/requirement.model');

// Create a new RequirementSet
async function createRequirementSet(req, res) {
  try {
    const { name, description, requirements } = req.body;

    // Validate that all requirements exist
    const validRequirements = await Requirement.find({ '_id': { $in: requirements } });
    if (validRequirements.length !== requirements.length) {
      return res.status(400).json({ message: 'Some requirements are invalid' });
    }

    // Create a new RequirementSet
    const requirementSet = new RequirementSet({
      name,
      description,
      requirements
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
    const requirementSets = await RequirementSet.find().populate('requirements');
    res.status(200).json(requirementSets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Requirement Sets', error: error.message });
  }
}

// Get a RequirementSet by ID
async function getRequirementSetById(req, res) {
  try {
    const requirementSet = await RequirementSet.findById(req.params.id).populate('requirements');
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
    const { name, description, requirements } = req.body;

    // Validate that all requirements exist
    const validRequirements = await Requirement.find({ '_id': { $in: requirements } });
    if (validRequirements.length !== requirements.length) {
      return res.status(400).json({ message: 'Some requirements are invalid' });
    }

    const requirementSet = await RequirementSet.findByIdAndUpdate(req.params.id, {
      name,
      description,
      requirements
    }, { new: true });

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