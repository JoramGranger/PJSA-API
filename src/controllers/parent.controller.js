// controllers/parent.controller.js
const Parent = require('../models/parent.model');
const User = require('../models/user.model');

// Create a new parent
async function createParent(req, res) {
  try {
    const parent = new Parent(req.body);
    await parent.save();
    res.status(201).json({ message: 'Parent created successfully', data: parent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating parent', error: error.message });
  }
}

// Get all parents
async function getAllParents(req, res) {
  try {
    const parents = await Parent.find().populate("students");
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parents', error: error.message });
  }
}

// Get parent by ID
async function getParentById(req, res) {
  try {
    const parent = await Parent.findById(req.params.id).populate("students");
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parent', error: error.message });
  }
}

// Update parent by ID
async function updateParent(req, res) {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json({ message: 'Parent updated successfully', data: parent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating parent', error: error.message });
  }
}

// Delete parent by ID
async function deleteParent(req, res) {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    
    // Remove parent_id reference from associated user account if exists
    await User.updateMany(
      { parent_id: req.params.id },
      { $set: { parent_id: null } }
    );
    
    res.status(200).json({ message: 'Parent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting parent', error: error.message });
  }
}

// Add a student to parent
async function addStudentToParent(req, res) {
  try {
    const { parentId, studentId } = req.body;
    
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    
    // Check if student already exists in parent's students array
    if (parent.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already assigned to this parent' });
    }
    
    // Add student to parent's students array
    parent.students.push(studentId);
    await parent.save();
    
    res.status(200).json({ message: 'Student added to parent successfully', data: parent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student to parent', error: error.message });
  }
}

// Remove a student from parent
async function removeStudentFromParent(req, res) {
  try {
    const { parentId, studentId } = req.params;
    
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    
    // Check if student exists in parent's students array
    if (!parent.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not assigned to this parent' });
    }
    
    // Remove student from parent's students array
    parent.students = parent.students.filter(student => student.toString() !== studentId);
    await parent.save();
    
    res.status(200).json({ message: 'Student removed from parent successfully', data: parent });
  } catch (error) {
    res.status(500).json({ message: 'Error removing student from parent', error: error.message });
  }
}

// Get all parents for a specific student
async function getParentsByStudentId(req, res) {
  try {
    const studentId = req.params.studentId;
    const parents = await Parent.find({ students: studentId });
    
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parents for student', error: error.message });
  }
}

// Create parent with user account
async function createParentWithAccount(req, res) {
  try {
    const { parentData, userData } = req.body;
    
    // Create parent document
    const parent = new Parent(parentData);
    await parent.save();
    
    // Create user account for parent if userData is provided
    if (userData) {
      userData.role = "parent";
      userData.parent_id = parent._id;
      
      const user = new User(userData);
      await user.save();
    }
    
    res.status(201).json({ 
      message: 'Parent created successfully with user account', 
      data: { parent, hasAccount: !!userData }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating parent with account', error: error.message });
  }
}

module.exports = {
  createParent,
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
  addStudentToParent,
  removeStudentFromParent,
  getParentsByStudentId,
  createParentWithAccount
};