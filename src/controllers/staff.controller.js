// controllers/staff.controller.js
const Staff = require('../models/staff.model');
const User = require('../models/user.model');

// Create a new staff member
async function createStaff(req, res) {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({ message: 'Staff created successfully', data: staff });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ 
        message: 'Staff with this email already exists',
        error: 'Duplicate email address'
      });
    }
    res.status(500).json({ message: 'Error creating staff', error: error.message });
  }
}

// Get all staff members
async function getAllStaff(req, res) {
  try {
    const staff = await Staff.find()
      .populate('subjects')
      .populate('classes')
      .populate('user', 'username email role');
    
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
}

// Get staff member by ID
async function getStaffById(req, res) {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('subjects')
      .populate('classes')
      .populate('user', 'username email role');
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
}

// Update staff member by ID
async function updateStaff(req, res) {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    res.status(200).json({ message: 'Staff updated successfully', data: staff });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ 
        message: 'Cannot update staff - this email is already in use by another staff member',
        error: 'Duplicate email address'
      });
    }
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
}

// Delete staff member by ID
async function deleteStaff(req, res) {
  try {
    const staff = await Staff.findById(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // If staff has a user account, detach or delete it
    if (staff.user) {
      // Option 1: Detach user from staff (keeping user account)
      await User.findByIdAndUpdate(
        staff.user,
        { $unset: { staff_id: 1 } }
      );
      
      // Option 2: Delete user account (uncomment if preferred)
      // await User.findByIdAndDelete(staff.user);
    }
    
    // Now delete the staff
    await Staff.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
}

// Get staff by department
async function getStaffByDepartment(req, res) {
  try {
    const { department } = req.params;
    
    const staff = await Staff.find({ department })
      .populate('subjects')
      .populate('classes');
    
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff by department', error: error.message });
  }
}

// Get staff by employment status
async function getStaffByStatus(req, res) {
  try {
    const { status } = req.params;
    
    const staff = await Staff.find({ employmentStatus: status })
      .populate('subjects')
      .populate('classes');
    
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff by status', error: error.message });
  }
}

// Add a subject to a teacher's subjects
async function addSubjectToTeacher(req, res) {
  try {
    const { staffId, subjectId } = req.body;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if subject already exists in teacher's subjects array
    if (staff.subjects.includes(subjectId)) {
      return res.status(400).json({ message: 'Subject already assigned to this teacher' });
    }
    
    // Add subject to teacher's subjects array
    staff.subjects.push(subjectId);
    await staff.save();
    
    res.status(200).json({ message: 'Subject added to teacher successfully', data: staff });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subject to teacher', error: error.message });
  }
}

// Remove a subject from a teacher's subjects
async function removeSubjectFromTeacher(req, res) {
  try {
    const { staffId, subjectId } = req.params;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if subject exists in teacher's subjects array
    if (!staff.subjects.includes(subjectId)) {
      return res.status(400).json({ message: 'Subject not assigned to this teacher' });
    }
    
    // Remove subject from teacher's subjects array
    staff.subjects = staff.subjects.filter(subject => subject.toString() !== subjectId);
    await staff.save();
    
    res.status(200).json({ message: 'Subject removed from teacher successfully', data: staff });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subject from teacher', error: error.message });
  }
}

// Add a class to a teacher's classes
async function addClassToTeacher(req, res) {
  try {
    const { staffId, classId } = req.body;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if class already exists in teacher's classes array
    if (staff.classes.includes(classId)) {
      return res.status(400).json({ message: 'Class already assigned to this teacher' });
    }
    
    // Add class to teacher's classes array
    staff.classes.push(classId);
    await staff.save();
    
    res.status(200).json({ message: 'Class added to teacher successfully', data: staff });
  } catch (error) {
    res.status(500).json({ message: 'Error adding class to teacher', error: error.message });
  }
}

// Remove a class from a teacher's classes
async function removeClassFromTeacher(req, res) {
  try {
    const { staffId, classId } = req.params;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if class exists in teacher's classes array
    if (!staff.classes.includes(classId)) {
      return res.status(400).json({ message: 'Class not assigned to this teacher' });
    }
    
    // Remove class from teacher's classes array
    staff.classes = staff.classes.filter(cls => cls.toString() !== classId);
    await staff.save();
    
    res.status(200).json({ message: 'Class removed from teacher successfully', data: staff });
  } catch (error) {
    res.status(500).json({ message: 'Error removing class from teacher', error: error.message });
  }
}

// Create staff with user account
async function createStaffWithAccount(req, res) {
  try {
    const { staffData, userData } = req.body;
    
    // Create staff document
    const staff = new Staff(staffData);
    await staff.save();
    
    // Create user account if userData is provided
    if (userData) {
      userData.role = userData.role || "staff";
      userData.staff_id = staff._id;
      
      const user = new User(userData);
      await user.save();
      
      // Link user to staff
      staff.user = user._id;
      await staff.save();
    }
    
    res.status(201).json({
      message: 'Staff created successfully with user account',
      data: { staff, hasAccount: !!userData }
    });
  } catch (error) {
    if (error.code === 11000) {
      // Check if the error is from staff email or user email
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({ 
          message: 'Staff with this email already exists',
          error: 'Duplicate staff email address'
        });
      } else {
        return res.status(409).json({ 
          message: 'User with this email or username already exists',
          error: 'Duplicate user credentials'
        });
      }
    }
    res.status(500).json({ message: 'Error creating staff with account', error: error.message });
  }
}

// Get teachers by subject
async function getTeachersBySubject(req, res) {
  try {
    const { subjectId } = req.params;
    
    const teachers = await Staff.find({ subjects: subjectId })
      .populate('subjects')
      .populate('classes');
    
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers by subject', error: error.message });
  }
}

// Get teachers by class
async function getTeachersByClass(req, res) {
  try {
    const { classId } = req.params;
    
    const teachers = await Staff.find({ classes: classId })
      .populate('subjects')
      .populate('classes');
    
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers by class', error: error.message });
  }
}

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffByDepartment,
  getStaffByStatus,
  addSubjectToTeacher,
  removeSubjectFromTeacher,
  addClassToTeacher,
  removeClassFromTeacher,
  createStaffWithAccount,
  getTeachersBySubject,
  getTeachersByClass
};