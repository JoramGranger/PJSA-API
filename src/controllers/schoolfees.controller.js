// controllers/schoolfees.controller.js
const SchoolFees = require('../models/schoolfees.model');
const Student = require('../models/student.model');
const AcademicTerm = require('../models/academicTerm.model');
const SchoolClass = require('../models/class.model');

// Create a new school fees transaction
async function createSchoolFees(req, res) {
  try {
    // Validate if student exists
    const student = await Student.findById(req.body.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate if academic term exists
    const academicTerm = await AcademicTerm.findById(req.body.academicTerm);
    if (!academicTerm) {
      return res.status(404).json({ message: 'Academic term not found' });
    }

    // Validate if class exists
    const schoolClass = await SchoolClass.findById(req.body.studentClass);
    if (!schoolClass) {
      return res.status(404).json({ message: 'School class not found' });
    }

    // Get the current balance for this student and term
    const currentBalance = await SchoolFees.getCurrentBalance(
      req.body.student, 
      req.body.academicTerm
    );

    // Calculate new balance
    const newBalance = currentBalance - req.body.amount;

    // Create school fees transaction with calculated balance
    const schoolFeesData = {
      ...req.body,
      bf: currentBalance,
      bal: newBalance
    };

    const schoolFees = new SchoolFees(schoolFeesData);
    await schoolFees.save();

    // Populate the saved document
    await schoolFees.populate([
      { path: 'student', select: 'firstName lastName otherName fullName' },
      { path: 'academicTerm', select: 'name year' },
      { path: 'studentClass', select: 'name level' }
    ]);

    res.status(201).json({ 
      message: 'School fees transaction created successfully', 
      data: schoolFees 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating school fees transaction', 
      error: error.message 
    });
  }
}

// Get all school fees transactions
async function getAllSchoolFees(req, res) {
  try {
    const { 
      page = 1, 
      limit = 50,
      termId,
      classId,
      studentId,
      startDate,
      endDate
    } = req.query;

    // Build filter
    const filter = {};
    if (termId) filter.academicTerm = termId;
    if (classId) filter.studentClass = classId;
    if (studentId) filter.student = studentId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const schoolFees = await SchoolFees.find(filter)
      .populate('student', 'firstName lastName otherName fullName EMISNo')
      .populate('academicTerm', 'name year')
      .populate('studentClass', 'name level')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await SchoolFees.countDocuments(filter);

    res.status(200).json({
      data: schoolFees,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching school fees', 
      error: error.message 
    });
  }
}

// Get school fees transaction by ID
async function getSchoolFeesById(req, res) {
  try {
    const schoolFees = await SchoolFees.findById(req.params.id)
      .populate('student', 'firstName lastName otherName fullName EMISNo LINNumber')
      .populate('academicTerm', 'name year startDate endDate')
      .populate('studentClass', 'name level section');
    
    if (!schoolFees) {
      return res.status(404).json({ message: 'School fees transaction not found' });
    }
    
    res.status(200).json(schoolFees);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching school fees transaction', 
      error: error.message 
    });
  }
}

// Update school fees transaction by ID
async function updateSchoolFees(req, res) {
  try {
    // Note: Be careful when updating financial records
    // Consider if you want to allow updates or just create adjustment transactions
    
    const schoolFees = await SchoolFees.findById(req.params.id);
    
    if (!schoolFees) {
      return res.status(404).json({ message: 'School fees transaction not found' });
    }

    // If amount is being updated, recalculate balance
    if (req.body.amount && req.body.amount !== schoolFees.amount) {
      const difference = req.body.amount - schoolFees.amount;
      req.body.bal = schoolFees.bal - difference;
    }

    const updatedSchoolFees = await SchoolFees.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate([
      { path: 'student', select: 'firstName lastName otherName fullName' },
      { path: 'academicTerm', select: 'name year' },
      { path: 'studentClass', select: 'name level' }
    ]);
    
    res.status(200).json({ 
      message: 'School fees transaction updated successfully', 
      data: updatedSchoolFees 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating school fees transaction', 
      error: error.message 
    });
  }
}

// Delete school fees transaction by ID
async function deleteSchoolFees(req, res) {
  try {
    const schoolFees = await SchoolFees.findById(req.params.id);
    
    if (!schoolFees) {
      return res.status(404).json({ message: 'School fees transaction not found' });
    }
    
    // Consider if you really want to allow deletion of financial records
    // You might want to implement soft delete or status change instead
    
    await SchoolFees.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'School fees transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting school fees transaction', 
      error: error.message 
    });
  }
}

// Get school fees transactions by student
async function getSchoolFeesByStudent(req, res) {
  try {
    const { studentId } = req.params;
    const { termId } = req.query;

    // Validate if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const schoolFees = await SchoolFees.getStudentTransactions(studentId, termId);
    
    // Calculate summary
    const summary = {
      totalPaid: schoolFees.reduce((sum, fee) => sum + fee.amount, 0),
      currentBalance: schoolFees.length > 0 ? schoolFees[schoolFees.length - 1].bal : 0,
      transactionCount: schoolFees.length
    };

    res.status(200).json({
      student: {
        id: student._id,
        name: student.fullName,
        class: student.currentClass
      },
      transactions: schoolFees,
      summary
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching student school fees', 
      error: error.message 
    });
  }
}

// Get school fees by class
async function getSchoolFeesByClass(req, res) {
  try {
    const { classId } = req.params;
    const { termId } = req.query;

    const filter = { studentClass: classId };
    if (termId) filter.academicTerm = termId;

    const schoolFees = await SchoolFees.find(filter)
      .populate('student', 'firstName lastName otherName fullName')
      .populate('academicTerm', 'name year')
      .sort({ date: -1 });
    
    // Group by student for summary
    const studentSummary = {};
    schoolFees.forEach(fee => {
      const studentId = fee.student._id.toString();
      if (!studentSummary[studentId]) {
        studentSummary[studentId] = {
          student: fee.student,
          totalPaid: 0,
          currentBalance: fee.bal,
          transactionCount: 0
        };
      }
      studentSummary[studentId].totalPaid += fee.amount;
      studentSummary[studentId].transactionCount += 1;
    });

    res.status(200).json({
      transactions: schoolFees,
      summary: Object.values(studentSummary)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching school fees by class', 
      error: error.message 
    });
  }
}

// Get school fees by term
async function getSchoolFeesByTerm(req, res) {
  try {
    const { termId } = req.params;
    
    const schoolFees = await SchoolFees.find({ academicTerm: termId })
      .populate('student', 'firstName lastName otherName fullName')
      .populate('studentClass', 'name level')
      .sort({ date: -1 });
    
    // Calculate term summary
    const summary = {
      totalCollected: schoolFees.reduce((sum, fee) => sum + fee.amount, 0),
      transactionCount: schoolFees.length,
      uniqueStudents: new Set(schoolFees.map(fee => fee.student._id.toString())).size
    };

    res.status(200).json({
      transactions: schoolFees,
      summary
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching school fees by term', 
      error: error.message 
    });
  }
}

// Get current balance for a student
async function getStudentBalance(req, res) {
  try {
    const { studentId } = req.params;
    const { termId } = req.query;

    if (!termId) {
      return res.status(400).json({ message: 'Academic term ID is required' });
    }

    const balance = await SchoolFees.getCurrentBalance(studentId, termId);
    
    const student = await Student.findById(studentId)
      .select('firstName lastName otherName fullName');

    res.status(200).json({
      student: student,
      academicTerm: termId,
      currentBalance: balance
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching student balance', 
      error: error.message 
    });
  }
}

// Generate school fees report
async function generateSchoolFeesReport(req, res) {
  try {
    const { startDate, endDate, termId, classId } = req.query;

    const filter = {};
    if (termId) filter.academicTerm = termId;
    if (classId) filter.studentClass = classId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const schoolFees = await SchoolFees.find(filter)
      .populate('student', 'firstName lastName otherName fullName')
      .populate('academicTerm', 'name year')
      .populate('studentClass', 'name level')
      .sort({ date: 1 });

    // Generate report summary
    const report = {
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Current'
      },
      summary: {
        totalTransactions: schoolFees.length,
        totalAmount: schoolFees.reduce((sum, fee) => sum + fee.amount, 0),
        uniqueStudents: new Set(schoolFees.map(fee => fee.student._id.toString())).size
      },
      transactions: schoolFees
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error generating school fees report', 
      error: error.message 
    });
  }
}

// Admin view for school fees
async function getAdminView(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const schoolFees = await SchoolFees.find()
      .populate('student', 'firstName lastName otherName fullName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip(skip);

    // Format for admin view
    const adminData = schoolFees.map(fee => ({
      transactionId: fee._id,
      studentName: fee.student.fullName,
      date: fee.date,
      bf: fee.bf,
      rn: fee.rn || 'N/A',
      amount: fee.amount,
      balance: fee.bal
    }));

    const total = await SchoolFees.countDocuments();

    res.status(200).json({
      data: adminData,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching admin view', 
      error: error.message 
    });
  }
}

module.exports = {
  createSchoolFees,
  getAllSchoolFees,
  getSchoolFeesById,
  updateSchoolFees,
  deleteSchoolFees,
  getSchoolFeesByStudent,
  getSchoolFeesByClass,
  getSchoolFeesByTerm,
  getStudentBalance,
  generateSchoolFeesReport,
  getAdminView
};