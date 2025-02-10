const Requirement = require('../models/requirement.model');

// Create a new requirement
async function createRequirement(req, res) {
  try {
    const requirement = new Requirement(req.body);
    await requirement.save();
    res.status(201).json({ message: 'Requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating requirement', error: error.message });
  }
}

// Get all requirements
async function getAllRequirements(req, res) {
  try {
    const requirements = await Requirement.find();
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements', error: error.message });
  }
}

// Get a requirement by ID
async function getRequirementById(req, res) {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.status(200).json(requirement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirement', error: error.message });
  }
}

// Update a requirement by ID
async function updateRequirement(req, res) {
  try {
    const requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.status(200).json({ message: 'Requirement updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ message: 'Error updating requirement', error: error.message });
  }
}

// Delete a requirement by ID
async function deleteRequirement(req, res) {
  try {
    const requirement = await Requirement.findByIdAndDelete(req.params.id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.status(200).json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting requirement', error: error.message });
  }
}

module.exports = {
  createRequirement,
  getAllRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement
};
