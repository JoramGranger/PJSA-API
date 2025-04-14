// controllers/student.controller.js
const Student = require('../models/student.model');
const Parent = require('../models/parent.model');
const User = require('../models/user.model');

// Create a new student
async function createStudent(req, res) {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student created successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
}

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await Student.find()
      .populate('currentClass')
      .populate('parents.parent')
      .populate('registeredBy', 'username email');
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
}

// Get student by ID
async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id)
      .populate('currentClass')
      .populate('parents.parent')
      .populate('registeredBy', 'username email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
}

// Update student by ID
async function updateStudent(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
}

// Delete student by ID
async function deleteStudent(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Find all parents associated with this student
    const studentId = req.params.id;
    
    // Remove this student from all parents' students arrays
    await Parent.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );
    
    // Now delete the student
    await Student.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
}

// Add parent to student
async function addParentToStudent(req, res) {
  try {
    const { studentId, parentId, relationship, isPrimaryContact } = req.body;
    
    // Validate if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Validate if parent exists
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    
    // Check if parent already exists in student's parents array
    const parentExists = student.parents.some(p => p.parent.toString() === parentId);
    if (parentExists) {
      return res.status(400).json({ message: 'Parent already assigned to this student' });
    }
    
    // Add parent to student
    student.parents.push({
      parent: parentId,
      relationship: relationship || parent.relationship,
      isPrimaryContact: isPrimaryContact || false
    });
    
    // If this is set as primary contact, ensure no other parent is primary
    if (isPrimaryContact) {
      student.parents.forEach(p => {
        if (p.parent.toString() !== parentId) {
          p.isPrimaryContact = false;
        }
      });
    }
    
    await student.save();
    
    // Add student to parent's students array if not already there
    if (!parent.students.includes(studentId)) {
      parent.students.push(studentId);
      await parent.save();
    }
    
    res.status(200).json({ 
      message: 'Parent added to student successfully', 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding parent to student', 
      error: error.message 
    });
  }
}

// Remove parent from student
async function removeParentFromStudent(req, res) {
  try {
    const { studentId, parentId } = req.params;
    
    // Validate if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if parent exists in student's parents array
    const parentIndex = student.parents.findIndex(p => p.parent.toString() === parentId);
    if (parentIndex === -1) {
      return res.status(400).json({ message: 'Parent not assigned to this student' });
    }
    
    // Remove parent from student
    student.parents.splice(parentIndex, 1);
    await student.save();
    
    // Remove student from parent's students array
    await Parent.findByIdAndUpdate(
      parentId,
      { $pull: { students: studentId } }
    );
    
    res.status(200).json({ 
      message: 'Parent removed from student successfully', 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing parent from student', 
      error: error.message 
    });
  }
}

// Get students by class ID
async function getStudentsByClass(req, res) {
  try {
    const classId = req.params.classId;
    const students = await Student.find({ currentClass: classId })
      .populate('parents.parent')
      .populate('currentClass');
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching students by class', 
      error: error.message 
    });
  }
}

// Get students by academic status
async function getStudentsByStatus(req, res) {
  try {
    const { status } = req.params;
    const students = await Student.find({ academicStatus: status })
      .populate('parents.parent')
      .populate('currentClass');
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching students by status', 
      error: error.message 
    });
  }
}

// Update student primary contact
async function updatePrimaryContact(req, res) {
  try {
    const { studentId, parentId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if parent exists in student's parents array
    const parentExists = student.parents.some(p => p.parent.toString() === parentId);
    if (!parentExists) {
      return res.status(400).json({ message: 'Parent not assigned to this student' });
    }
    
    // Update primary contact status
    student.parents.forEach(p => {
      p.isPrimaryContact = p.parent.toString() === parentId;
    });
    
    await student.save();
    
    res.status(200).json({ 
      message: 'Primary contact updated successfully', 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating primary contact', 
      error: error.message 
    });
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addParentToStudent,
  removeParentFromStudent,
  getStudentsByClass,
  getStudentsByStatus,
  updatePrimaryContact
};