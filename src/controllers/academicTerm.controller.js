const AcademicTerm = require('../models/academicTerm.model');

// Create a new academic term
async function createAcademicTerm(req, res) {
  try {
    const academicTerm = new AcademicTerm(req.body);
    await academicTerm.save();
    res.status(201).json({ message: 'Academic term created successfully', data: academicTerm });
  } catch (error) {
    res.status(500).json({ message: 'Error creating academic term', error: error.message });
  }
}

// Get all academic terms
async function getAllAcademicTerms(req, res) {
  try {
    const academicTerms = await AcademicTerm.find().populate("academic_year_id");
    res.status(200).json(academicTerms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching academic terms', error: error.message });
  }
}

// Get academic term by ID
async function getAcademicTermById(req, res) {
  try {
    const academicTerm = await AcademicTerm.findById(req.params.id).populate("academic_year_id");
    if (!academicTerm) {
      return res.status(404).json({ message: 'Academic term not found' });
    }
    res.status(200).json(academicTerm);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching academic term', error: error.message });
  }
}

// Update academic term by ID
async function updateAcademicTerm(req, res) {
  try {
    const academicTerm = await AcademicTerm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!academicTerm) {
      return res.status(404).json({ message: 'Academic term not found' });
    }
    res.status(200).json({ message: 'Academic term updated successfully', data: academicTerm });
  } catch (error) {
    res.status(500).json({ message: 'Error updating academic term', error: error.message });
  }
}

// Delete academic term by ID
async function deleteAcademicTerm(req, res) {
  try {
    const academicTerm = await AcademicTerm.findByIdAndDelete(req.params.id);
    if (!academicTerm) {
      return res.status(404).json({ message: 'Academic term not found' });
    }
    res.status(200).json({ message: 'Academic term deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting academic term', error: error.message });
  }
}

module.exports = {
  createAcademicTerm,
  getAllAcademicTerms,
  getAcademicTermById,
  updateAcademicTerm,
  deleteAcademicTerm
};
