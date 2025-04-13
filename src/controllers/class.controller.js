const SchoolClass = require('../models/class.model');

// Create a new class
async function createClass(req, res) {
  try {
    const schoolClass = new SchoolClass(req.body);
    await schoolClass.save();
    res.status(201).json({ message: 'Class created successfully', data: schoolClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
}

// Get all classes
async function getAllClasses(req, res) {
  try {
    const classes = await SchoolClass.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
}

// Get a class by ID
async function getClassById(req, res) {
  try {
    const schoolClass = await SchoolClass.findById(req.params.id);
    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(schoolClass);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
}

// Update a class by ID
async function updateClass(req, res) {
  try {
    const schoolClass = await SchoolClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class updated successfully', data: schoolClass });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
}

// Delete a class by ID
async function deleteClass(req, res) {
  try {
    const schoolClass = await SchoolClass.findByIdAndDelete(req.params.id);
    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
}

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};
