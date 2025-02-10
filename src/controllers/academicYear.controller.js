const AcademicYear = require('../models/academicYear.model');

// Create a new academic year
async function createAcademicYear(req, res) {
  try {
    const academicYear = new AcademicYear(req.body);
    await academicYear.save();
    res.status(201).json({ message: 'Academic year created successfully', data: academicYear });
  } catch (error) {
    res.status(500).json({ message: 'Error creating academic year', error: error.message });
  }
}

// Get all academic years
async function getAllAcademicYears(req, res) {
  try {
    const academicYears = await AcademicYear.find();
    res.status(200).json(academicYears);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching academic years', error: error.message });
  }
}

// Get academic year by ID
async function getAcademicYearById(req, res) {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);
    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.status(200).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching academic year', error: error.message });
  }
}

// Update academic year by ID
async function updateAcademicYear(req, res) {
  try {
    const academicYear = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.status(200).json({ message: 'Academic year updated successfully', data: academicYear });
  } catch (error) {
    res.status(500).json({ message: 'Error updating academic year', error: error.message });
  }
}

// Delete academic year by ID
async function deleteAcademicYear(req, res) {
  try {
    const academicYear = await AcademicYear.findByIdAndDelete(req.params.id);
    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.status(200).json({ message: 'Academic year deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting academic year', error: error.message });
  }
}

module.exports = {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademicYear
};
